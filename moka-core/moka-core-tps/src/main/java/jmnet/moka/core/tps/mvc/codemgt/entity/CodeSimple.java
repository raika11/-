package jmnet.moka.core.tps.mvc.codemgt.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
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
@Entity
@Table(name = "TB_15RE_CODE_MGT")
public class CodeSimple implements Serializable {

    private static final long serialVersionUID = 1L;

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
     * 상세코드
     */
    @Column(name = "DTL_CD", nullable = false)
    private String dtlCd;

    /**
     * 코드명
     */
    @Nationalized
    @Column(name = "CD_NM", nullable = false)
    private String cdNm;

    /**
     * 사용여부(Y:사용, N:미사용)
     */
    @Column(name = "USED_YN")
    @Builder.Default
    private String usedYn = MokaConstants.YES;

    /**
     * 코드순서
     */
    @Column(name = "CD_ORD")
    @Builder.Default
    private Integer cdOrd = 1;

}
