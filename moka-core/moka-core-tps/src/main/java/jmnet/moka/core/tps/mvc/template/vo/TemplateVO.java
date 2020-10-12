package jmnet.moka.core.tps.mvc.template.vo;

import java.io.Serializable;
import javax.persistence.Column;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import org.apache.ibatis.type.Alias;

@Alias("templateVO")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class TemplateVO implements Serializable {
    
    private static final long serialVersionUID = 8921206765125787780L;
    
    @Column(name = "SERVICE_PLATFORM")
    private String servicePlatform;
    
    @Column(name = "DOMAIN_ID")
    private String domainId;
    
    @Column(name = "DOMAIN_NAME")
    private String domainName;

    @Column(name = "TEMPLATE_SEQ")
    private Long templateSeq;

    @Column(name = "TEMPLATE_NAME")
    private String templateName;
    
    @Column(name = "TEMPLATE_WIDTH")
    private Integer templateWidth;
    
    @Column(name = "TEMPLATE_THUMB")
    private String templateThumb;
    
    @Column(name = "TP_ZONE")
    private String tpZone;

    @Column(name = "USE_YN")
    private String useYn;
    
    @Column(name = "REL_ORD")
    private Integer relOrd;
}
