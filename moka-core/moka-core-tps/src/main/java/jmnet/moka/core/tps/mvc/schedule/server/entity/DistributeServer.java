package jmnet.moka.core.tps.mvc.schedule.server.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import jmnet.moka.core.tps.mvc.member.entity.MemberSimpleInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 배포서버 엔티티 2021. 1. 26. 김정민
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_GEN_TARGET")
public class DistributeServer extends BaseAudit {

    private static final long serialVersionUID = 1L;

    /**
     * 서버 번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SERVER_SEQ", nullable = false)
    private Long serverSeq;

    /**
     * 삭제여부(Y:삭제, N:미삭제)
     */
    @Column(name = "DEL_YN", columnDefinition = "char")
    @Builder.Default
    private String delYn = MokaConstants.NO;

    /**
     * 서버 명
     */
    @Column(name = "SERVER_NM")
    private String serverNm;

    /**
     * IP / HOST
     */
    @Column(name = "SERVER_IP")
    private String serverIp;

    /**
     * 계정정보
     */
    @Column(name = "ACCESS_ID")
    private String accessId;

    /**
     * 계정비밀번호
     */
    @Column(name = "ACCESS_PWD", insertable = false, updatable = false)
    private String accessPwd;



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "REG_ID", insertable = false, updatable = false)
    private MemberSimpleInfo regMember;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MOD_ID", insertable = false, updatable = false)
    private MemberSimpleInfo modMember;

}
