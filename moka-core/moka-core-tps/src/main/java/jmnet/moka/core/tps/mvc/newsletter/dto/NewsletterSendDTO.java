package jmnet.moka.core.tps.mvc.newsletter.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.validation.constraints.Email;
import javax.validation.constraints.Min;
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
 * ClassName : NewsletterSendDTO
 * Created : 2021-04-19 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-19 오후 1:21
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder(toBuilder = true)
@Alias("NewsletterSendDTO")
public class NewsletterSendDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<NewsletterSendDTO>>() {
    }.getType();

    @ApiModelProperty("발송일련번호")
    @Min(value = 0, message = "{tps.common.error.min.seqNo}")
    private Long sendSeq;

    @ApiModelProperty("레터일련번호")
    @Min(value = 0, message = "{tps.common.error.min.seqNo}")
    private Long letterSeq;

    @ApiModelProperty("AB테스트여부")
    private String abtestYn;

    @ApiModelProperty("A / B")
    private String abDiv;

    @ApiModelProperty("전송상태(S:성공, F:실패, N:데이터없음, R:예약)")
    private String sendStatus;

    @ApiModelProperty("발송자명")
    private String senderName;

    @ApiModelProperty("발송자이메일")
    @Email
    private String senderEmail;

    @ApiModelProperty("노출여부")
    private String viewYn;

    @ApiModelProperty("예약여부")
    private String reserveYn;

    @ApiModelProperty("발송일시")
    @DTODateTimeFormat
    private Date sendDt;

    @ApiModelProperty("구독자연동여부(Y/N-excel업로드)")
    private String scbLinkYn;

    @ApiModelProperty("레이아웃일련번호")
    @Min(value = 0, message = "{tps.common.error.min.seqNo}")
    private Long containerSeq;

    @ApiModelProperty("헤더이미지")
    private String headerImg;

    @ApiModelProperty("등록일시")
    @DTODateTimeFormat
    private Date regDt;

    @ApiModelProperty("등록자")
    private String regId;

    @ApiModelProperty("편집폼 아이템 일련번호")
    @Min(value = 0, message = "{tps.common.error.min.seqNo}")
    private Long partSeq;

    @ApiModelProperty("레터제목")
    private String letterTitle;

    @ApiModelProperty("엑셀업로드이메일목록")
    private String uploadEmail;

    @ApiModelProperty("수동레터본문")
    private String letterBody;

}
