package jmnet.moka.core.tps.mvc.template.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <pre>
 * 템플릿ID, 도메인정보, 템플릿명
 * 2020. 2. 6. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 2. 6. 오후 5:45:58
 * @author jeon
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class TemplateSimpleDTO implements Serializable {

    private static final long serialVersionUID = -1994333408930259505L;

    public static final Type TYPE = new TypeReference<List<TemplateSimpleDTO>>() {}.getType();

    private Long templateSeq;

    @NotNull(message = "{template.error.invalid.domainId}")
    private DomainSimpleDTO domain;

    @NotNull(message = "{template.error.invalid.templateName}")
    @Pattern(regexp = ".+", message = "{template.error.invalid.templateName}")
    private String templateName;
    
    private String templateGroupName;

}
