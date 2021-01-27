package jmnet.moka.core.tps.mvc.schedule.server.entity;

import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import lombok.*;
import org.hibernate.annotations.Nationalized;

import javax.persistence.*;

/**
 * 배포서버
 * 2021. 1. 26. 김정민
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
    @Column(name = "SERVER_NM", nullable = false)
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
}
