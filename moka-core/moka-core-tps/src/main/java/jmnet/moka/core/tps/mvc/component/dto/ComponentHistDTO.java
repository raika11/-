package jmnet.moka.core.tps.mvc.component.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.core.tps.mvc.dataset.dto.DatasetDTO;
import jmnet.moka.core.tps.mvc.template.dto.TemplateSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <pre>
 * 컴포넌트 히스토리 DTO
 * 2020. 4. 13. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 4. 13. 오후 5:34:36
 * @author jeon
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ComponentHistDTO implements Serializable {

    private static final long serialVersionUID = -3702675486171185188L;

    public static final Type TYPE = new TypeReference<List<ComponentHistDTO>>() {
    }.getType();

    private Long seq;

    private Long componentSeq;

    private String domainId;

    private DatasetDTO dataset;

    private TemplateSimpleDTO template;

    private String dataType;

    private String snapshotBody;

    private String workType;

    private String createYmdt;

    private String creator;
}
