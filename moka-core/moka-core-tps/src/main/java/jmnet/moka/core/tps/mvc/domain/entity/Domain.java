package jmnet.moka.core.tps.mvc.domain.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * The persistent class for the WMS_DOMAIN database table.
 * 
 */
@Entity
@Table(name = "TB_WMS_DOMAIN")
@NamedQuery(name = "Domain.findAll", query = "SELECT d FROM Domain d")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Domain implements Serializable {

    private static final long serialVersionUID = -6113879324816610973L;

    @Id
    @Column(name = "DOMAIN_ID", columnDefinition = "char")
    private String domainId;

    @Column(name = "DOMAIN_NAME")
    private String domainName;

    @Column(name = "DOMAIN_URL")
    private String domainUrl;

    @Column(name = "SERVICE_PLATFORM", columnDefinition = "char")
    private String servicePlatform;

    @Column(name = "USE_YN", columnDefinition = "char")
    private String useYn;

    @Column(name = "MEDIA_ID", columnDefinition = "char")
    private String mediaId;

    @Column(name = "LANG")
    private String lang;

    @Column(name = "API_HOST")
    private String apiHost;

    @Column(name = "API_PATH")
    private String apiPath;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "REG_DT")
    private String createYmdt;

    @Column(name = "REG_ID")
    private String creator;

    @Column(name = "MOD_DT")
    private String modifiedYmdt;

    @Column(name = "MOD_ID")
    private String modifier;


}
