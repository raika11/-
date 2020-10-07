package jmnet.moka.core.tps.mvc.domain.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.*;

import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import lombok.*;


/**
 * The persistent class for the TB_WMS_DOMAIN database table.
 * 
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_WMS_DOMAIN")
@NamedQuery(name = "Domain.findAll", query = "SELECT d FROM Domain d")
public class Domain implements Serializable {

    private static final long serialVersionUID = -6113879324816610973L;

    /**
     * 도메인 ID
     */
    @Id
    @Column(name = "DOMAIN_ID", columnDefinition = "char", length = 4)
    private String domainId;

    /**
     * 도메인 명
     */
    @Column(name = "DOMAIN_NAME", nullable = false, length = 64)
    private String domainName;

    /**
     * 도메인 URL
     */
    @Column(name = "DOMAIN_URL", nullable = false, length = 512)
    private String domainUrl;

    /**
     * 서비스 플랫폼 P : PC, M : 모바일
     */
    @Column(name = "SERVICE_PLATFORM", columnDefinition = "char", nullable = false)
    private String servicePlatform;

    /**
     * 사용여부 Y : 예, N : 아니오
     */
    @Column(name = "USE_YN", columnDefinition = "char", nullable = false)
    private String useYn;

    /**
     * 언어
     */
    @Column(name = "LANG", nullable = false, length = 24)
    private String lang;

    /**
     * api host
     */
    @Column(name = "API_HOST", length = 256)
    private String apiHost;

    /**
     * api path
     */
    @Column(name = "API_PATH", length = 256)
    private String apiPath;

    /**
     * 도메인 상세 설명
     */
    @Column(name = "DESCRIPTION", length = 4000)
    private String description;

    /**
     * 등록 일시
     */
    @Column(name = "REG_DT")
    @Temporal(TemporalType.TIMESTAMP)
    private Date regDt;

    /**
     * 등록 아이디
     */
    @Column(name = "REG_ID", length = 30)
    private String regId;

    /**
     * 수정 일시
     */
    @Column(name = "MOD_DT")
    @Temporal(TemporalType.TIMESTAMP)
    private Date modDt;

    /**
     * 수정 아이디
     */
    @Column(name = "MOD_ID", length = 30)
    private String modId;

    /**
     * 신규 등록 전 처리
     */
    @PrePersist
    public void prePersist() {
        this.servicePlatform = McpString.defaultValue(this.servicePlatform, "P");
        this.useYn = McpString.defaultValue(this.useYn, "Y");
        this.lang = McpString.defaultValue(this.lang, "KR");
        this.regDt = McpDate.defaultValue(this.regDt);
    }

    /**
     * 수정 전 처리
     */
    @PreUpdate
    public void preUpdate() {
        this.servicePlatform = McpString.defaultValue(this.servicePlatform, "P");
        this.useYn = McpString.defaultValue(this.useYn, "Y");
        this.lang = McpString.defaultValue(this.lang, "KR");
        this.regDt = McpDate.defaultValue(this.regDt);
        this.modDt = McpDate.defaultValue(this.modDt);;
    }
}
