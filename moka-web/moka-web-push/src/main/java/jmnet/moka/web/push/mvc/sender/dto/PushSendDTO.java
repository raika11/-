package jmnet.moka.web.push.mvc.sender.dto;

import io.swagger.annotations.ApiModelProperty;
import jmnet.moka.core.common.MokaConstants;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
 * <pre>
 * 푸시 요청 정보
 * Project : moka
 * Package : jmnet.moka.web.push.mvc.sender.dto
 * ClassName : PushSendDTO
 * Created : 2021-02-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-08 15:36
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class PushSendDTO {

    /**
     * 앱 일련번호
     */
    @ApiModelProperty(value = "앱 일련번호", required = true)
    private String[] appSeq;

    /**
     * 요청일자
     */
    @ApiModelProperty(value = "출고예약(요청일자)")
    @DateTimeFormat(pattern = MokaConstants.JSON_DATE_FORMAT)
    private Date rsvDt;

    /**
     * 푸시기사 일련번호
     */
    @ApiModelProperty(value = "푸시기사 일련번호", required = true)
    @Min(value = 0, message = "{wpush.common.error.min.seq}")
    @NotNull(message = "{wpush.error.notnull.id}")
    private Long relContentId;

    /**
     * 푸시기사 제목
     */
    @ApiModelProperty(value = "푸시기사 제목", required = true)
    @NotNull(message = "{wpush.error.notnull.title}")
    private String title;

    /**
     * 푸시기사 내용
     */
    @ApiModelProperty(value = "푸시기사 내용", required = true)
    @NotNull(message = "{wpush.error.notnull.content}")
    private String content;

    /**
     * 푸시기사 푸시종류(속보:T, 추천기사:S, 미리보는오늘:R, 뉴스룸레터:N)
     */
    @ApiModelProperty(value = "푸시기사 푸시종류(속보:T, 추천기사:S, 미리보는오늘:R, 뉴스룸레터:N)", required = true)
    @NotNull(message = "{wpush.error.notnull.pushType}")
    @Pattern(regexp = "[T|S|R|N]{1}$", message = "{wpush.error.pattern.pushType}")
    private String pushType;

    /**
     * 푸시기사 Push제목의 아이콘 부분(속보:B, 단독:S)
     */
    @ApiModelProperty(value = "푸시기사 Push제목의 아이콘 부분(속보:B, 단독:S)", required = true)
    @Pattern(regexp = "[B|S]{1}$", message = "{wpush.error.pattern.iconType}")
    private String iconType;

    /**
     * 레터에서 편집자 사진 노출여부(Y/N)
     */
    @ApiModelProperty(value = "레터에서 편집자 사진 노출여부(Y/N)")
    @Pattern(regexp = "[Y|N]{1}$", message = "{wpush.error.pattern.picYn}")
    private String picYn;

    /**
     * 메일 발송 여부 ( Y:발송, N:발송안함 )
     */
    @ApiModelProperty(value = "메일 발송 여부 ( Y:발송, N:발송안함 )")
    @Pattern(regexp = "[Y|N]{1}$", message = "{wpush.error.pattern.sendEmailYn}")
    private String sendEmail;

    /**
     * 작성 기자 아이디 - 뉴스룸 레터용
     */
    @ApiModelProperty(value = "작성 기자 아이디 - 뉴스룸 레터용")
    private String repId;

    /**
     * 관련 콘텐트URL
     */
    @ApiModelProperty(value = "관련 콘텐트URL")
    @Size(min = 0, max = 200, message = "{wpush.error.size.relUrl}")
    private String relUrl;

    /**
     * 이미지URL
     */
    @ApiModelProperty(value = "이미지URL")
    @Size(min = 0, max = 200, message = "{wpush.error.size.imgUrl}")
    private String imgUrl;

    /**
     * 푸시이미지URL
     */
    @ApiModelProperty(value = "푸시이미지URL")
    @Size(min = 0, max = 200, message = "{wpush.error.size.pushUrl}")
    private String pushUrl;
}
