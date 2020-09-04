package jmnet.moka.core.tps.mvc.media.dto;

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

/**
 * <pre>
 * Media DTO
 * 2020. 4. 14. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 4. 14. 오전 11:48:30
 * @author jeon
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class MediaDTO implements Serializable {

    private static final long serialVersionUID = -6175169409059810305L;

    public static final Type TYPE = new TypeReference<List<MediaDTO>>() {}.getType();

    private String mediaId;

    private String mediaName;

    private String mediaType;

    private String parentMediaId;

    private String siteId;

    private String description;

}
