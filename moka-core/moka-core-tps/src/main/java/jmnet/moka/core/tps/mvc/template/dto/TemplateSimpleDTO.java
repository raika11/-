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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

/**
 * 간단 템플릿 : 템플릿ID, 도메인정보, 템플릿명
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class TemplateSimpleDTO implements Serializable {

    private static final long serialVersionUID = -1994333408930259505L;

    public static final Type TYPE = new TypeReference<List<TemplateSimpleDTO>>() {}.getType();

    /**
     * 템플릿SEQ
     */
    private Long templateSeq;

    /**
     * 도메인
     */
    @NotNull(message = "{template.error.invalid.domainId}")
    private DomainSimpleDTO domain;

    /**
     * 템플릿명
     */
    @NotNull(message = "{tps.template.error.notnull.templateName}")
    @Pattern(regexp = ".+", message = "{tps.template.error.pattern.templateName}")
    @Length(min = 1, max = 128, message = "{tps.template.error.length.templateName}")
    private String templateName;

    /**
     * 템플릿그룹명
     */
    private String templateGroupName;

}
