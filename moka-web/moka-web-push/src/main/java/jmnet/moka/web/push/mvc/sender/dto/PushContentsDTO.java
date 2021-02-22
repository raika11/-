package jmnet.moka.web.push.mvc.sender.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
/**
 * <pre>
 * 푸시 전송 기사 정보
 * Project : moka
 * Package : jmnet.moka.web.push.mvc.sender.dto
 * ClassName : PushContentsDTO
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
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel("푸시 전송 기사 DTO")
public class PushContentsDTO implements Serializable {

    private static final long serialVersionUID = 1L;
    public static final Type TYPE = new TypeReference<List<PushContentsDTO>>() {
    }.getType();

    /**
     * 푸시기사 일련번호
     */
    @ApiModelProperty("푸시기사 일련번호")
    private Long contentSeq;


    /**     노출유무     */
    private String usedYn;
    /**     푸시상태     */
    private String pushYn;


    /**
     * 푸시기사 푸시종류(속보:T, 추천기사:S, 미리보는오늘:R, 뉴스룸레터:N)
     */
    @ApiModelProperty("푸시기사 푸시종류(속보:T, 추천기사:S, 미리보는오늘:R, 뉴스룸레터:N)")
    private String pushType;

    /**
     * 푸시기사 Push제목의 아이콘 부분(속보:B, 단독:S)
     */
    @ApiModelProperty("푸시기사 Push제목의 아이콘 부분(속보:B, 단독:S)")
    private String iconType;

    /**
     * 레터에서 편집자 사진 노출여부(Y/N)
     */
    @ApiModelProperty("레터에서 편집자 사진 노출여부(Y/N)")
    private String picYn;

    /**
     *  메일 발송 여부 ( Y:발송, N:발송안함 )
     */
    @ApiModelProperty("메일 발송 여부 ( Y:발송, N:발송안함 )")
    private String sendEmail;

    /**
     * 출고예약
     */
    @ApiModelProperty("출고예약일자")
    private Date rsvDt;

    /**
     * 작성 기자 아이디 - 뉴스룸 레터용
     */
    @ApiModelProperty("작성 기자 아이디 - 뉴스룸 레터용")
    private String repId;

    /**
     * 등록일시
     */
    @ApiModelProperty("등록일시")
    private Date regDt;

    /**
     * 등록자 아이디
     */
    @ApiModelProperty("등록자 아이디")
    private String regId;

    /**
     * 수정일시
     */
    @ApiModelProperty("수정일시")
    private Date modDt;

    /**
     * 수정자 아이디
     */
    @ApiModelProperty("수정자 아이디")
    private String modId;

    /**
     * 관련 콘텐트ID
     */
    @ApiModelProperty("관련 콘텐트ID")
    private Long relContentId;

    /**
     * 관련 콘텐트URL
     */
    @ApiModelProperty("관련 콘텐트URL")
    private String relUrl;

    /**
     * 이미지 URL
     */
    @ApiModelProperty("이미지 URL")
    private String imgUrl;

    /**
     * 푸시 이미지 URL
     */
    @ApiModelProperty("푸시 이미지 URL")
    private String pushImgUrl;

    /**
     * 푸시기사 제목
     */
    @ApiModelProperty("푸시기사 제목")
    private String title;

    /**
     * 서브 타이틀(편집용)
     */
    @ApiModelProperty("서브 타이틀(편집용)")
    private String subTitle;

    /**
     * 푸시기사 내용
     */
    @ApiModelProperty("푸시기사 내용")
    private String content;





}
