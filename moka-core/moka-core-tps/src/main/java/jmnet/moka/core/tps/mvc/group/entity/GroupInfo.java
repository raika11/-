package jmnet.moka.core.tps.mvc.group.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.entity.RegAudit;
import jmnet.moka.core.tps.mvc.member.entity.MemberInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

/**
 * CMS 권한그룸
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "TB_CMS_GROUP")
public class GroupInfo extends RegAudit {

    private static final long serialVersionUID = 1L;

    /**
     * 그룹코드 (G01, G02형식)
     */
    @Id
    @Column(name = "GRP_CD", nullable = false)
    private String groupCd;

    /**
     * 그룹명
     */
    @Column(name = "GRP_NM", nullable = false)
    private String groupNm;

    /**
     * 그룹 한글명
     */
    @Column(name = "GRP_KOR_NM")
    private String groupKorNm = "";

    /**
     * 사용여부
     */
    @Column(name = "USED_YN")
    private String usedYn = MokaConstants.YES;

    /**
     * 등록자
     */
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "REG_ID", insertable = false, updatable = false)
    private MemberInfo regMember;
}
