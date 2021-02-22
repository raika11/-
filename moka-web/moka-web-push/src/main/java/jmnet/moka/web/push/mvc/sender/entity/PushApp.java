package jmnet.moka.web.push.mvc.sender.entity;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * 푸시 앱 정보
 */
@Entity
@Table(name = "TB_PUSH_APP")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class PushApp implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 앱일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "APP_SEQ", nullable = false)
    private Long appSeq;

    /**
     * 앱명
     */
    @Column(name = "APP_NAME")
    private String appName;

    /**
     * Device OS (AND, iOS, PWA)
     */
    @Column(name = "APP_OS", nullable = false)
    private String appOs;

    /**
     * 디바이스 구분 (T:Tablet, M:Mobile)
     */
    @Column(name = "DEV_DIV", nullable = false)
    private String devDiv;

    /**
     * 앱 구분(J:중앙일보, M:미세먼지)
     */
    @Column(name = "APP_DIV", nullable = false)
    private String appDiv;

    /**
     * FCM 발행 API KEY
     */
    @Column(name = "API_KEY", nullable = false)
    private String apiKey;

    /**
     * 등록일시
     */
    @Column(name = "REG_DT")
    private Date regDt;

    /**
     * 수정일시
     */
    @Column(name = "MOD_DT")
    private Date modDt;

    //@Transient
    //private String fcmKey;

}
