package jmnet.moka.core.tps.mvc.template.vo;

import java.io.Serializable;
import javax.persistence.Column;
import org.apache.ibatis.type.Alias;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("templateVO")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
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
    
    @Column(name = "REL_ORDER")
    private Integer relOrder;
}
