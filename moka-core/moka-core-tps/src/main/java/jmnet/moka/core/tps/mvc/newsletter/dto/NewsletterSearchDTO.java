package jmnet.moka.core.tps.mvc.newsletter.dto;

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
import org.hibernate.validator.constraints.Length;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.newsletter.dto
 * ClassName : NewsletterSearchDTO
 * Created : 2021-04-16 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-16 오후 4:15
 */
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = true)
@Alias("NewsletterSearchDTO")
public class NewsletterSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 1L;

    //    /**
    //     * 뉴스레터 일련번호
    //     */
    //    @ApiModelProperty("뉴스레터 일련번호")
    //    @Min(value = 0, message = "{tps.common.error.min.seqNo}")
    //    private Long letterSeq;

    /**
     * 유형
     */
    @ApiModelProperty("레터유형")
    @Pattern(regexp = "^()|(O)|(B)|(N)|(E)$", message = "{tps.newsletter.error.pattern.letterType}")
    private String letterType;

    /**
     * 상태
     */
    @ApiModelProperty("상태")
    @Pattern(regexp = "^()|(Y)|(P)|(S)|(Q)$", message = "{tps.newsletter.error.pattern.status}")
    private String status;

    /**
     * 방송방법
     */
    @ApiModelProperty("발송유형")
    @Pattern(regexp = "^()|(A)|(E)$", message = "{tps.newsletter.error.pattern.sendType}")
    private String sendType;

    @ApiModelProperty(value = "시작일시 검색")
    @DTODateTimeFormat
    private Date startDt;

    @ApiModelProperty(value = "종료일시 검색")
    @DTODateTimeFormat
    private Date endDt;

    /**
     * A/B 테스트 여부
     */
    @ApiModelProperty(value = "A/B 테스트여부")
    @Pattern(regexp = "^()|(Y)|(N)$", message = "{tps.newsletter.error.pattern.abtestYn}")
    private String abtestYn;

    /**
     * 뉴스레터 명
     */
    @ApiModelProperty(value = "레터명")
    @Length(max = 100, message = "{tps.newsletter.error.size.letterName}")
    private String letterName;
}
