package jmnet.moka.web.push.mvc.sender.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import io.swagger.annotations.ApiModelProperty;
import jmnet.moka.core.common.MokaConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

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
    private Long jobSeq;

    @Builder.Default
    private List<PushAppDTO> pushApps = new ArrayList<>();

    /**
     * 요청일자
     */
    @ApiModelProperty("요청일자")
    //@DateTimeFormat(pattern = MokaConstants.JSON_DATE_FORMAT)
    //private Date reserveDt;
    @DateTimeFormat(pattern = MokaConstants.JSON_DATE_FORMAT)
    private String reserveDt;



    /**
     * 푸시기사 일련번호
     */
    @ApiModelProperty(value = "푸시기사 일련번호", required = true)
    private Long relContentId;
    /**
     * 푸시기사 제목
     */
    @ApiModelProperty(value = "푸시기사 제목", required = true)
    private String title;
    /**
     * 푸시기사 내용
     */
    @ApiModelProperty(value = "푸시기사 내용", required = true)
    private String content;
    /**
     * 푸시기사 푸시종류(속보:T, 추천기사:S, 미리보는오늘:R, 뉴스룸레터:N)
     */
    @ApiModelProperty(value = "푸시기사 푸시종류(속보:T, 추천기사:S, 미리보는오늘:R, 뉴스룸레터:N)", required = true)
    private String pushType;
    /**
     * 푸시기사 Push제목의 아이콘 부분(속보:B, 단독:S)
     */
    @ApiModelProperty(value = "푸시기사 Push제목의 아이콘 부분(속보:B, 단독:S)", required = true)
    private String iconType;


}
