package jmnet.moka.core.tps.mvc.newsletter.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.newsletter.dto
 * ClassName : NewsletterSendSimpleDTO
 * Created : 2021-04-20 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-20 오후 3:06
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder(toBuilder = true)
@Alias("NewsletterSendSimpleDTO")
public class NewsletterSendSimpleDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<NewsletterSendSimpleDTO>>() {
    }.getType();

    private String letterType;

    @ApiModelProperty("발송일련번호")
    private Long sendSeq;

    @ApiModelProperty("레터일련번호")
    private Long letterSeq;

    @ApiModelProperty("레터제목")
    private String letterTitle;

    @ApiModelProperty("레터제목")
    private String letterName;

    @ApiModelProperty("발송일시")
    @DTODateTimeFormat
    private Date sendDt;

    private String abtestYn;
}
