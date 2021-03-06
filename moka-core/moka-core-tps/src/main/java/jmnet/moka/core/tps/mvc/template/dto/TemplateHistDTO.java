package jmnet.moka.core.tps.mvc.template.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

/**
 * <pre>
 * 템플릿 히스토리 DTO
 * 2020. 1. 14. jeon 최초생성
 * </pre>
 *
 * @author jeon
 * @since 2020. 1. 14. 오후 1:33:39
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class TemplateHistDTO implements Serializable {

    private static final long serialVersionUID = -1832383484260622074L;

    public static final Type TYPE = new TypeReference<List<TemplateHistDTO>>() {
    }.getType();

    /**
     * 일련번호
     */
    @Min(value = 0, message = "{tps.templatehist.error.min.seq}")
    private Long seq;

    /**
     * 템플릿
     */
    @JsonIgnore
    @NotNull(message = "{tps.template.error.notnull.templateSeq}")
    private TemplateDTO template;

    /**
     * 도메인ID
     */
    @NotNull(message = "{tps.domain.error.notnull.domainId}")
    @Pattern(regexp = "[0-9]{4}$", message = "{tps.domain.error.pattern.domainId}")
    private String domainId;

    /**
     * 템플릿본문
     */
    @Builder.Default
    private String templateBody = "";

    /**
     * 등록일자
     */
    //    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = MokaConstants.JSON_DATE_FORMAT, timezone = MokaConstants.JSON_DATE_TIME_ZONE)
    //    @DateTimeFormat(pattern = MokaConstants.JSON_DATE_FORMAT)
    @DTODateTimeFormat
    private Date regDt;

    /**
     * 등록자
     */
    @Length(max = 30, message = "{tps.templatehist.error.length.regId}")
    private String regId;
}
