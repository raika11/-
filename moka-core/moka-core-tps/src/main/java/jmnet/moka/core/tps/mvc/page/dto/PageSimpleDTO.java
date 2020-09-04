package jmnet.moka.core.tps.mvc.page.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.core.common.MspConstants;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "pageSeq")
public class PageSimpleDTO implements Serializable {

    private static final long serialVersionUID = -3629594236709756375L;

    public static final Type TYPE = new TypeReference<List<PageSimpleDTO>>() {}.getType();

    @Min(value = 0, message = "{tps.page.error.invalid.pageSeq}")
    private Long pageSeq;

    @NotNull(message = "{tps.page.error.invalid.pageName}")
    @Pattern(regexp = ".+", message = "{tps.page.error.invalid.pageName}")
    private String pageName;

    @Pattern(regexp = MspConstants.PAGE_SERVICE_NAME_PATTERN,
            message = "{tps.page.error.invalid.pageServiceName}")
    private String pageServiceName;

    private String pageDisplayName;

    @NotNull(message = "{tps.page.error.invalid.domainId}")
    private DomainSimpleDTO domain;

    @NotNull(message = "{tps.page.error.invalid.pageType}")
    @Pattern(regexp = ".+", message = "{tps.page.error.invalid.pageType}")
    private String pageType;

    @NotNull(message = "{tps.page.error.invalid.pageUrl}")
    @Pattern(regexp = ".+", message = "{tps.page.error.invalid.pageUrl}")
    private String pageUrl;

    @NotNull(message = "{tps.page.error.invalid.useYn}}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.page.error.invalid.useYn}")
    private String useYn;

    private String description;
}
