package jmnet.moka.core.tps.mvc.domain.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


/**
 * The persistent class for the TB_WMS_DOMAIN database table.
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_WMS_DOMAIN")
@NamedQuery(name = "Domain.findAll", query = "SELECT d FROM Domain d")
public class Domain extends BaseAudit {

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
     * 신규 등록 전 처리
     */
    @PrePersist
    public void prePersist() {
        this.servicePlatform = McpString.defaultValue(this.servicePlatform, "P");
        this.useYn = McpString.defaultValue(this.useYn, "Y");
        this.lang = McpString.defaultValue(this.lang, "KR");
    }

    /**
     * 수정 전 처리
     */
    @PreUpdate
    public void preUpdate() {
        this.servicePlatform = McpString.defaultValue(this.servicePlatform, "P");
        this.useYn = McpString.defaultValue(this.useYn, "Y");
        this.lang = McpString.defaultValue(this.lang, "KR");
    }
}
