package jmnet.moka.core.tps.mvc.template.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;

import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * <pre>
 * 템플릿 히스토리 DTO
 * 2020. 1. 14. jeon 최초생성
 * </pre>
 * 
 * @since 2020. 1. 14. 오후 1:33:39
 * @author jeon
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class TemplateHistDTO implements Serializable {

    private static final long serialVersionUID = -1832383484260622074L;

    public static final Type TYPE = new TypeReference<List<TemplateHistDTO>>() {}.getType();

    private Long seq;

    @JsonIgnore
    @NotNull(message = "{tps.template.error.invalid.templateSeq}")
    private TemplateDTO template;

    private String domainId;

    private String templateBody;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = MokaConstants.JSON_DATE_FORMAT, timezone = MokaConstants.JSON_DATE_TIME_ZONE)
    @DateTimeFormat(pattern = MokaConstants.JSON_DATE_FORMAT)
    private Date regDt;

    private String regId;
}
