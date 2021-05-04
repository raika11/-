package jmnet.moka.core.tps.mvc.articlePackage.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModelProperty;
import java.util.Date;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchDTO;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.articlePackage.dto
 * ClassName : ArticlePackageSearchDTO
 * Created : 2021-05-03 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-05-03 오후 4:03
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@Alias("ArticlePackageSearchDTO")
public class ArticlePackageSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;

    /**
     * 유형
     */
    @ApiModelProperty("패키지 유형(A:전체기사, S:섹션, D:출고일)")
    // TODO: msg
    @Pattern(regexp = "^()|(A)|(A)|(D)$", message = "{tps.newsletter.error.pattern.letterType}")
    private String pkgDiv;

    /**
     * 구독 가능 여부
     */
    @ApiModelProperty("구독 가능 여부")
    // TODO: msg
    @Pattern(regexp = "^()|(Y)|(N)$", message = "{tps.newsletter.error.pattern.letterType}")
    private String scbYn;

    /**
     * 검색일 기준
     */
    @ApiModelProperty("검색일 기준 (S: 등록일, E: 종료일")
    // TODO: msg
    @Pattern(regexp = "^(S)|(E)$", message = "{tps.newsletter.error.pattern.letterType}")
    private String searchDtType = "S";

    @ApiModelProperty(value = "시작일시 검색")
    @DTODateTimeFormat
    private Date startDt;

    @ApiModelProperty(value = "종료일시 검색")
    @DTODateTimeFormat
    private Date endDt;
}
