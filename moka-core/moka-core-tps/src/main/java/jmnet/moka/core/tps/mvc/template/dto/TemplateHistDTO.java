package jmnet.moka.core.tps.mvc.template.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <pre>
 * 템플릿 히스토리 DTO
 * 2020. 1. 14. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 1. 14. 오후 1:33:39
 * @author jeon
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class TemplateHistDTO implements Serializable {

    private static final long serialVersionUID = -1832383484260622074L;

    public static final Type TYPE = new TypeReference<List<TemplateHistDTO>>() {}.getType();

    private Long seq;

    private String createYmdt;

    private String creator;

    private String domainId;

    private String templateBody;

    @JsonIgnore
    @NotNull(message = "{tps.template.error.invalid.templateSeq}")
    private TemplateDTO template;

}
