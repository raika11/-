package jmnet.moka.core.tps.mvc.ad.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.core.tps.mvc.domain.dto.DomainDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class AdDTO implements Serializable {
    
    private static final long serialVersionUID = 6196628863616063174L;
    
    public static final Type TYPE = new TypeReference<List<AdDTO>>() {}.getType();
    
    private Long adSeq;
    
    private String adBody;
    
    private Integer adDeptNo;
    
    private String adFileName;
    
    private Integer adHeight;
    
    private Integer adWidth;
    
    private String adLocation;
    
    private String adName;
    
    private String adType;
    
    private String adUseType;
    
    private String createYmdt;
    
    private String creator;
    
    private String description;
    
    private DomainDTO domain;
    
    private String modifiedYmdt;
    
    private String modifier;
    
    private String periodEndYmdt;
    
    private String periodStartYmdt;
    
    private String periodYn;
    
    private String slideType;
    
    private String useYn;

}
