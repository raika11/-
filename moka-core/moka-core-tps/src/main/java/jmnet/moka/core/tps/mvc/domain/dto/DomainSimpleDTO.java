package jmnet.moka.core.tps.mvc.domain.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.*;

/**
 * <pre>
 * 도메인ID, 매체ID, 도메인명, 볼륨ID
 * 2020. 2. 6. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 2. 6. 오후 5:46:30
 * @author jeon
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class DomainSimpleDTO implements Serializable {

    private static final long serialVersionUID = -7979684085879328911L;

    public static final Type TYPE = new TypeReference<List<DomainSimpleDTO>>() {}.getType();

    private String domainId;

    private String domainName;

    private String domainUrl;

    private String volumeId;
    
    private String servicePlatform;
}
