package jmnet.moka.core.tps.mvc.ad.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.type.TypeReference;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class AdSimpleDTO implements Serializable {
    private static final long serialVersionUID = 2417485808772469182L;
    
    public static final Type TYPE = new TypeReference<List<AdSimpleDTO>>() {}.getType();
    
    private Long adSeq;
    
    private String adName;
    
}
