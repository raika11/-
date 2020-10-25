package jmnet.moka.core.tps.mvc.group.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import jmnet.moka.core.tps.mvc.member.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * CMS 그룹별 사용자
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@EqualsAndHashCode(exclude = {"group", "member"})
@Entity
@Table(name = "TB_CMS_GRP_MEM")
public class GroupMember extends BaseAudit {

    private static final long serialVersionUID = 1L;

    /**
     * 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SEQ_NO", nullable = false)
    private Long seqNo;

    /**
     * 그룹코드(TB_CMS_GROUP.GRP_CD)
     */
    @Column(name = "GRP_CD", nullable = false)
    private String groupCd;

    /**
     * 그룹정보
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "GRP_CD", nullable = false, insertable = false, updatable = false)
    private Group group;

    /**
     * 사용여부(Y:사용, N:미사용)
     */
    @Column(name = "USED_YN")
    @Builder.Default
    private String usedYn = "Y";

    /**
     * 사용자ID(TB_CMS_MEM.MEM_ID)
     */
    @Column(name = "MEM_ID", nullable = false)
    private String memberId;

    /**
     * 사용자 정보
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEM_ID", nullable = false, insertable = false, updatable = false)
    private Member member;

}
