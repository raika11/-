package jmnet.moka.web.schedule.mvc.gen.entity;

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

/**
 * <pre>
 * 배포서버 entity
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.gen.entity
 * ClassName : GenTarget
 * Created : 2021-02-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-08 12:00
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_GEN_TARGET")
public class GenTarget {

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
    @Column(name = "ACCESS_PWD")
    private String accessPwd;



}
