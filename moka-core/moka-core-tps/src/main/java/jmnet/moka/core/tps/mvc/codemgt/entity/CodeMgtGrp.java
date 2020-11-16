package jmnet.moka.core.tps.mvc.codemgt.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;


/**
 * 기타코드 그룹
 */

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@EqualsAndHashCode(exclude = "codeMgts")
//@JsonInclude(Include.NON_NULL)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "grpCd")
@Entity
@Table(name = "TB_15RE_CODE_MGT_GRP")
public class CodeMgtGrp extends BaseAudit {

    private static final long serialVersionUID = 7521210132764582029L;

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
    @Column(name = "GRP_CD", nullable = false)
    private String grpCd;

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
     * 상세코드목록
     */
    @Builder.Default
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "codeMgtGrp", cascade = CascadeType.REMOVE)
    private Set<CodeMgt> codeMgts = new LinkedHashSet<CodeMgt>();
}
