package jmnet.moka.core.tps.mvc.domain.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.*;

import jmnet.moka.common.utils.McpDate;
import lombok.*;


/**
 * The persistent class for the WMS_DOMAIN database table.
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

    @Id
    @Column(name = "DOMAIN_ID", columnDefinition = "char", length = 4)
    private String domainId;

    @Column(name = "DOMAIN_NAME", nullable = false, length = 64)
    private String domainName;

    @Column(name = "DOMAIN_URL", nullable = false, length = 512)
    private String domainUrl;

    @Column(name = "SERVICE_PLATFORM", columnDefinition = "char", nullable = false)
    private String servicePlatform;

    @Column(name = "USE_YN", columnDefinition = "char", nullable = false)
    private String useYn;

    @Column(name = "LANG", nullable = false, length = 24)
    private String lang;

    @Column(name = "API_HOST", length = 256)
    private String apiHost;

    @Column(name = "API_PATH", length = 256)
    private String apiPath;

    @Column(name = "DESCRIPTION", length = 4000)
    private String description;

    @Column(name = "REG_DT")
    @Temporal(TemporalType.TIMESTAMP)
    private Date regDt;

    @Column(name = "REG_ID", length = 50)
    private String regId;

    @Column(name = "MOD_DT")
    @Temporal(TemporalType.TIMESTAMP)
    private Date modDt;

    @Column(name = "MOD_ID", length = 50)
    private String modId;

    @PrePersist
    public void prePersist() {
        this.servicePlatform = this.servicePlatform == null ? "P" : this.servicePlatform;
        this.useYn = this.useYn == null ? "Y" : this.useYn;
        this.lang = this.lang == null ? "KR" : this.lang;
        this.regDt = this.regDt == null ? McpDate.now() : this.regDt;
    }

    @PreUpdate
    public void preUpdate() {
        this.servicePlatform = this.servicePlatform == null ? "P" : this.servicePlatform;
        this.useYn = this.useYn == null ? "Y" : this.useYn;
        this.lang = this.lang == null ? "KR" : this.lang;
        this.regDt = this.regDt == null ? McpDate.now() : this.regDt;
        this.modDt = this.modDt == null ? McpDate.now() : this.modDt;
    }
}
