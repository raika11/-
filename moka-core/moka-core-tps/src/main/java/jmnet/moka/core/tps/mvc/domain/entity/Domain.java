package jmnet.moka.core.tps.mvc.domain.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonFormat;
import jmnet.moka.core.common.MspConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;


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
    private Date regDt;

    @Column(name = "REG_ID")
    private String regId;

    @Column(name = "MOD_DT")
    private Date modDt;

    @Column(name = "MOD_ID")
    private String modId;
}
