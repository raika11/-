package jmnet.moka.core.tps.mvc.page.dto;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "pageSeq")
public class PageSimpleDTO implements Serializable {

    private static final long serialVersionUID = -3629594236709756375L;

    public static final Type TYPE = new TypeReference<List<PageSimpleDTO>>() {
    }.getType();

    /**
     * 페이지SEQ
     */
    @Min(value = 0, message = "{tps.page.error.min.pageSeq}")
    private Long pageSeq;

    /**
     * 도메인
     */
    @NotNull(message = "{tps.domain.error.notnull.domainId}")
    private DomainSimpleDTO domain;

    /**
     * 페이지명
     */
    @NotNull(message = "{tps.page.error.notnull.pageName}")
    @Pattern(regexp = ".+", message = "{tps.page.error.pattern.pageName}")
    @Length(min = 1, max = 256, message = "{tps.page.error.length.pageName}")
    private String pageName;

    /**
     * 페이지서비스명
     */
    @Pattern(regexp = MokaConstants.PAGE_SERVICE_NAME_PATTERN, message = "{tps.page.error.pattern.pageServiceName}")
    @Length(max = 256, message = "{tps.page.error.length.pageServiceName}")
    private String pageServiceName;

    /**
     * 페이지표출명
     */
    @Length(max = 256, message = "{tps.page.error.length.pageServiceName}")
    private String pageDisplayName;

    /**
     * 페이지유형 text/html, application/json, text/javascript, text/plain, text/xml
     */
    @NotNull(message = "{tps.page.error.notnull.pageType}")
    @Pattern(regexp = ".+", message = "{tps.page.error.pattern.pageType}")
    @Length(min = 1, max = 24, message = "{tps.page.error.length.pageType}")
    @Builder.Default
    private String pageType = TpsConstants.PAGE_TYPE_HTML;

    /**
     * 페이지URL
     */
    @NotNull(message = "{tps.page.error.notnull.pageUrl}")
    @Pattern(regexp = MokaConstants.PAGE_SERVICE_URL_PATTERN, message = "{tps.page.error.pattern.pageUrl}")
    @Length(min = 1, max = 512, message = "{tps.page.error.length.pageUrl}")
    private String pageUrl;

    /**
     * 사용여부
     */
    @NotNull(message = "{tps.page.error.notnull.usedYn}")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.page.error.pattern.usedYn}")
    @Builder.Default
    private String usedYn = MokaConstants.YES;

    /**
     * 상세정보
     */
    @Length(max = 4000, message = "{tps.page.error.len.description}")
    private String description;
}


