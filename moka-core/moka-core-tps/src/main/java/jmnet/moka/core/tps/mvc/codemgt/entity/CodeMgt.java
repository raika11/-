package jmnet.moka.core.tps.mvc.codemgt.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;


/**
 * 기타코드
 */

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@EqualsAndHashCode(exclude = "codeMgtGrp")
//@JsonInclude(Include.NON_NULL)
@Entity
@Table(name = "TB_15RE_CODE_MGT")
public class CodeMgt extends BaseAudit {

    private static final long serialVersionUID = -1877787466206944682L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO")
    private Long seqNo;

    /**
     * 그룹코드
     */
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "GRP_CD", referencedColumnName = "GRP_CD", nullable = false)
    private CodeMgtGrp codeMgtGrp;

    /**
     * 상세코드
     */
    @Column(name = "DTL_CD", nullable = false)
    private String dtlCd;

    /**
     * 코드순서
     */
    @Column(name = "CD_ORD")
    @Builder.Default
    private Integer cdOrd = 1;

    /**
     * 코드명
     */
    @Nationalized
    @Column(name = "CD_NM", nullable = false)
    private String cdNm;

    /**
     * 코드영문명
     */
    @Column(name = "CD_ENG_NM")
    private String cdEngNm;

    /**
     * 코드코멘트
     */
    @Nationalized
    @Column(name = "CD_COMMENT")
    private String cdComment;

    /**
     * 코드기타1
     */
    @Nationalized
    @Column(name = "CD_NM_ETC1")
    private String cdNmEtc1;

    /**
     * 코드기타2
     */
    @Nationalized
    @Column(name = "CD_NM_ETC2")
    private String cdNmEtc2;

    /**
     * 코드기타3
     */
    @Nationalized
    @Column(name = "CD_NM_ETC3")
    private String cdNmEtc3;

    /**
     * 사용여부(Y:사용, N:미사용)
     */
    @Column(name = "USED_YN", columnDefinition = "char")
    @Builder.Default
    private String usedYn = MokaConstants.YES;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        this.cdOrd = this.cdOrd == null ? 1 : this.cdOrd;
        this.usedYn = McpString.defaultValue(this.usedYn, MokaConstants.YES);
    }
}
