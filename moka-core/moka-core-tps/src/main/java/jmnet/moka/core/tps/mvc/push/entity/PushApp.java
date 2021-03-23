package jmnet.moka.core.tps.mvc.push.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;

/**
 * 푸시 앱
 */
@Entity
@Table(name = "TB_PUSH_APP")
@Data
public class PushApp implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 앱 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "APP_SEQ", nullable = false)
    private Integer appSeq;

    /**
     * 앱명칭
     */
    @Column(name = "APP_NAME")
    private String appName;

    /**
     * Device OS (AND, iOS, WIN, MAC)
     */
    @Column(name = "APP_OS", nullable = false)
    private String appOs;

    /**
     * 디바이스 구분 (T:Tablet, M:Mobile, PC : P)
     */
    @Column(name = "DEV_DIV", nullable = false)
    private String devDiv;

    /**
     * 앱 구분(J:중앙일보, M:미세먼지, PWA : P)
     */
    @Column(name = "APP_DIV", nullable = false)
    private String appDiv;

    /**
     * FCM 발행 API KEY
     */
    @Column(name = "API_KEY")
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

}
