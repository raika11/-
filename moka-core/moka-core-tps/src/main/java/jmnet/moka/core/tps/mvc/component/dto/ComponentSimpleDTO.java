package jmnet.moka.core.tps.mvc.component.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import jmnet.moka.core.tps.mvc.template.dto.TemplateSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 
 * <pre>
 * 컴포넌트아이디, 컴포넌트명, 데이터Api, 데이터Param, 데이터타입, 도메인, 템플릿
 * 2020. 4. 21. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 4. 21. 오전 10:25:48
 * @author jeon
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ComponentSimpleDTO implements Serializable {

    private static final long serialVersionUID = -5912885230431022389L;

    public static final Type TYPE = new TypeReference<List<ComponentSimpleDTO>>() {}.getType();

    private Long componentSeq;

    @NotBlank(message = "{tps.component.error.invalid.componentName}")
    private String componentName;

    private String dataType;

    @NotNull(message = "{tps.component.error.invalid.domainId}")
    private DomainSimpleDTO domain;

    @NotNull(message = "{tps.component.error.invalid.templateId}")
    private TemplateSimpleDTO template;
}
