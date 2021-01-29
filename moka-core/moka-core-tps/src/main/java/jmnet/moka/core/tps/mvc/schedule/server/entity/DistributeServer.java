package jmnet.moka.core.tps.mvc.schedule.server.entity;

import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import lombok.*;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.util.Date;

/**
 * 배포서버 조회용 엔티티
 * 2021. 1. 26. 김정민
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_GEN_TARGET")
public class DistributeServer {

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
     * 등록자
     */
    @CreatedBy
    @Column(name = "REG_ID")
    protected String regId;

    /**
     * 등록일시
     */
    @CreatedDate
    @Column(name = "REG_DT")
    protected Date regDt;

    /**
     * 수정자
     */
    @LastModifiedBy
    @Column(name = "MOD_ID")
    protected String modId;

    /**
     * 수정일시
     */
    @LastModifiedDate
    @Column(name = "MOD_DT")
    protected Date modDt;

    /**
     * 계정정보
     */
    @Column(name = "ACCESS_ID")
    private String accessId;

    /**
     * 계정비밀번호
     */
    @Column(name = "ACCESS_PWD")
    private String accessPwd;



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="REG_ID", insertable = false, updatable = false)
    private Member regMember;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="MOD_ID", insertable = false, updatable = false)
    private Member modMember;

}
