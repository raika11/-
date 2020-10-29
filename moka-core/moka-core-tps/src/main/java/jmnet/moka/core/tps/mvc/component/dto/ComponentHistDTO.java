package jmnet.moka.core.tps.mvc.component.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import jmnet.moka.core.tps.mvc.dataset.dto.DatasetDTO;
import jmnet.moka.core.tps.mvc.template.dto.TemplateSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

/**
 * 컴포넌트 히스토리 DTO
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ComponentHistDTO implements Serializable {

    private static final long serialVersionUID = -3702675486171185188L;

    public static final Type TYPE = new TypeReference<List<ComponentHistDTO>>() {
    }.getType();

    /**
     * 일련번호
     */
    @Min(value = 0, message = "{tps.componenthist.error.min.seq}")
    private Long seq;

    /**
     * 컴포넌트SEQ
     */
    @NotNull(message = "{tps.component.error.notnull.componentSeq}")
    private Long componentSeq;

    /**
     * 도메인ID
     */
    @NotNull(message = "{tps.domain.error.notnull.domainId}")
    private String domainId;

    /**
     * 데이타셋
     */
    private DatasetDTO dataset;

    /**
     * 템플릿
     */
    @NotNull(message = "{tps.template.error.notnull.templateSeq}")
    private TemplateSimpleDTO template;

    /**
     * 데이터유형:NONE, DESK, AUTO
     */
    @Pattern(regexp = "[(NONE)|(DESK)|(AUTO)]{4}$", message = "{tps.component.error.pattern.dataType}")
    @Builder.Default
    private String dataType = TpsConstants.DATATYPE_NONE;

    /**
     * 스냅샷본문
     */
    private String snapshotBody;

    /**
     * 등록일자
     */
    @DTODateTimeFormat
    private Date regDt;

    /**
     * 등록자
     */
    @Length(max = 30, message = "{tps.templatehist.error.length.regId}")
    private String regId;
}
