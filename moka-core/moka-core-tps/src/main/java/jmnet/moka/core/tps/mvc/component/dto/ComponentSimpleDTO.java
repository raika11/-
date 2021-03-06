package jmnet.moka.core.tps.mvc.component.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import jmnet.moka.core.tps.mvc.editform.dto.EditFormPartDTO;
import jmnet.moka.core.tps.mvc.template.dto.TemplateSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

/**
 * 간단한 컴포넌트 : 아이디, 컴포넌트명, 데이터Api, 데이터Param, 데이터타입, 도메인, 템플릿
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("간단 컴포넌트 DTO")
public class ComponentSimpleDTO implements Serializable {

    private static final long serialVersionUID = -5912885230431022389L;

    public static final Type TYPE = new TypeReference<List<ComponentSimpleDTO>>() {
    }.getType();

    @ApiModelProperty("컴포넌트SEQ")
    private Long componentSeq;

    @ApiModelProperty("컴포넌트명")
    @NotNull(message = "{tps.component.error.notnull.componentName}")
    @Pattern(regexp = ".+", message = "{tps.component.error.pattern.componentName}")
    @Length(min = 1, max = 128, message = "{tps.component.error.length.componentName}")
    private String componentName;

    @ApiModelProperty("데이터유형:NONE, DESK, AUTO, FORM")
    @Pattern(regexp = "[(NONE)|(DESK)|(AUTO)|(FORM)]{4}$", message = "{tps.component.error.pattern.dataType}")
    @Builder.Default
    private String dataType = TpsConstants.DATATYPE_NONE;

    @ApiModelProperty("도메인")
    @NotNull(message = "{tps.domain.error.notnull.domainId}")
    private DomainSimpleDTO domain;

    @ApiModelProperty("템플릿")
    @NotNull(message = "{tps.template.error.notnull.templateSeq}")
    private TemplateSimpleDTO template;

    @ApiModelProperty("에디트폼 파트")
    private EditFormPartDTO editFormPart;
}
