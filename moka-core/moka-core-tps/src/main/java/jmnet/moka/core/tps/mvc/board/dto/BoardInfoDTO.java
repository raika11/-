package jmnet.moka.core.tps.mvc.board.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.code.BoardTypeCode;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.board.dto
 * ClassName : BoardInfoDTO
 * Created : 2020-12-17 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-17 12:04
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@ApiModel("게시판 DTO")
public class BoardInfoDTO {
    public static final Type TYPE = new TypeReference<List<BoardInfoDTO>>() {
    }.getType();

    /**
     * 게시판ID
     */
    @ApiModelProperty(hidden = true)
    @Min(value = 0, message = "{tps.board-info.error.min.boardId}")
    private Integer boardId;


    /**
     * 게시판유형(S:서비스 / A:관리자)
     */
    @ApiModelProperty("게시판유형(S:서비스 / A:관리자)")
    @Builder.Default
    @NotNull(message = "{tps.board-info.error.pattern.boardType}")
    private BoardTypeCode boardType = BoardTypeCode.A;


    /**
     * 채널타입(예:JPOD)
     */
    @ApiModelProperty("채널타입(예:JPOD)")
    @Size(min = 0, max = 24, message = "{tps.board-info.error.size.channelType}")
    private String channelType;

    /**
     * 사용여부
     */
    @ApiModelProperty("사용여부")
    @Builder.Default
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.common.error.pattern.usedYn}")
    private String usedYn = MokaConstants.YES;

    /**
     * 삭제여부
     */
    @ApiModelProperty("삭제여부")
    @Builder.Default
    private String delYn = MokaConstants.NO;

    /**
     * 말머리1
     */
    @ApiModelProperty("말머리1")
    @Size(max = 20, message = "{tps.board-info.error.size.titlePrefixNm1}")
    private String titlePrefixNm1;

    /**
     * 말머리2
     */
    @ApiModelProperty("말머리2")
    @Size(max = 20, message = "{tps.board-info.error.size.titlePrefixNm2}")
    private String titlePrefixNm2;

    /**
     * 말머리1(텍스트 Comma(,)로 여러 개 입력)
     */
    @ApiModelProperty(value = "말머리1(텍스트 Comma(,)로 여러 개 입력)")
    @Size(max = 100, message = "{tps.board-info.error.size.titlePrefix1}")
    private String titlePrefix1;

    /**
     * 말머리2(텍스트 Comma(,)로 여러 개 입력)
     */
    @ApiModelProperty(value = "말머리2(텍스트 Comma(,)로 여러 개 입력)")
    @Size(max = 100, message = "{tps.board-info.error.size.titlePrefix2}")
    private String titlePrefix2;

    /**
     * 글쓰기 권한(0:모두 1:회원 9:관리자)
     */
    @ApiModelProperty("글쓰기 권한(0:모두 1:회원 9:관리자)")
    @Builder.Default
    @Pattern(regexp = "[0|1|9]{1}$", message = "{tps.board-info.error.pattern.insLevel}")
    private String insLevel = "9";

    /**
     * 조회 권한(0:모두 1:회원 9:관리자)
     */
    @ApiModelProperty("조회 권한(0:모두 1:회원 9:관리자)")
    @Builder.Default
    @Pattern(regexp = "[0|1|9]{1}$", message = "{tps.board-info.error.pattern.viewLevel}")
    private String viewLevel = "0";

    /**
     * 답변글 작성권한(0:모두 1:회원 9:관리자)
     */
    @ApiModelProperty("답변글 작성권한(0:모두 1:회원 9:관리자)")
    @Builder.Default
    @Pattern(regexp = "[0|1|9]{1}$", message = "{tps.board-info.error.pattern.answLevel}")
    private String answLevel = "9";

    /**
     * 댓글 작성권한(0:모두 1:회원)
     */
    @ApiModelProperty("댓글 작성권한(0:모두 1:회원)")
    @Builder.Default
    @Pattern(regexp = "[0|1]{1}$", message = "{tps.board-info.error.pattern.replyLevel}")
    private String replyLevel = "1";



    /**
     * 추천여부 0:사용안함 1:추천/비추천 2:추천만
     */
    @ApiModelProperty("추천여부 0:사용안함 1:추천/비추천 2:추천만")
    @Pattern(regexp = "[0|1|2]{1}$", message = "{tps.board-info.error.pattern.recomFlag}")
    @Builder.Default
    private String recomFlag = "0";

    /**
     * 에디터여부
     */
    @ApiModelProperty("에디터여부")
    @Builder.Default
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.board-info.error.pattern.editorYn}")
    private String editorYn = MokaConstants.NO;

    /**
     * 답글여부
     */
    @ApiModelProperty("답글여부")
    @Builder.Default
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.board-info.error.pattern.answYn}")
    private String answYn = MokaConstants.NO;

    /**
     * 댓글여부
     */
    @ApiModelProperty("댓글여부")
    @Builder.Default
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.board-info.error.pattern.replyYn}")
    private String replyYn = MokaConstants.NO;


    /**
     * 신고여부
     */
    @ApiModelProperty("신고여부")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.board-info.error.pattern.declareYn}")
    @Builder.Default
    private String declareYn = MokaConstants.NO;

    /**
     * 캡차여부
     */
    @ApiModelProperty("캡차여부")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.board-info.error.pattern.captchaYn}")
    @Builder.Default
    private String captchaYn = MokaConstants.NO;


    /**
     * 비밀글여부
     */
    @ApiModelProperty(value = "비밀글여부")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.board-info.error.pattern.secretYn}")
    @Builder.Default
    private String secretYn = MokaConstants.NO;

    /**
     * 순서지정여부
     */
    @ApiModelProperty(value = "순서지정여부")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.board-info.error.pattern.ordYn}")
    @Builder.Default
    private String ordYn = MokaConstants.NO;

    /**
     * 푸시발송여부(앱공지게시판의 경우)
     */
    @ApiModelProperty(value = "푸시발송여부(앱공지게시판의 경우)")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.board-info.error.pattern.pushYn}")
    @Builder.Default
    private String pushYn = MokaConstants.NO;



    @ApiModelProperty("이메일수신여부")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.board-info.error.pattern.emailReceiveYn}")
    @Builder.Default
    private String emailReceiveYn = MokaConstants.NO;

    @ApiModelProperty("수신이메일(여러명;로 구분)")
    private String receiveEmail;

    /**
     * 답변글 푸시발송여부
     */
    @ApiModelProperty(value = "답변글 푸시발송여부")
    @Builder.Default
    private String answPushYn = MokaConstants.NO;


    @ApiModelProperty("답변글 이메일발송여부")
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.board-info.error.pattern.emailSendYn}")
    @Builder.Default
    private String emailSendYn = MokaConstants.NO;


    @ApiModelProperty("답변글 이메일발송시 발송자이메일")
    private String sendEmail;

    /**
     * 파일업로드여부
     */
    @ApiModelProperty("파일업로드여부")
    @Builder.Default
    @Pattern(regexp = "[Y|N]{1}$", message = "{tps.board-info.error.pattern.fileYn}")
    private String fileYn = MokaConstants.YES;


    /**
     * 허용파일개수
     */
    @ApiModelProperty("허용파일개수")
    @Builder.Default
    @Max(value = 5, message = "{tps.board-info.error.size.allowFileCnt}")
    private Integer allowFileCnt = 5;

    /**
     * 허용되는 파일크기(MB)
     */
    @ApiModelProperty("허용되는 파일크기(MB)")
    @Builder.Default
    @Max(value = 10, message = "{tps.board-info.error.size.allowFileSize}")
    private Integer allowFileSize = 10;

    /**
     * 허용되는 파일확장자(;로 구분)
     */
    @ApiModelProperty("허용되는 파일확장자(,로 구분)")
    @Builder.Default
    //@Pattern(regexp = "zip,|xls,|xlsx,|ppt,|doc,|hwp,|jpg,|png,|gif,", message = "{tps.board-info.error.pattern.allowFileExt}")
    private String allowFileExt = "zip,xls,xlsx,ppt,doc,hwp,jpg,png,gif,";

    @ApiModelProperty("허용 컬럼(,로 구분)")
    @Size(max = 100, message = "{tps.board-info.error.size.allowItem}")
    private String allowItem;

    /**
     * 게시판 URL
     */
    @ApiModelProperty("게시판 URL")
    @Size(min = 0, max = 200, message = "{tps.board-info.error.size.boardUrl}")
    private String boardUrl;


    /**
     * 게시판명
     */
    @ApiModelProperty("게시판명")
    @NotEmpty(message = "{tps.board-info.error.size.boardName}")
    @Size(min = 2, max = 100, message = "{tps.board-info.error.size.boardName}")
    private String boardName;


    /**
     * 게시판설명
     */
    @ApiModelProperty("게시판설명")
    @Size(min = 0, max = 500, message = "{tps.board-info.error.size.boardDesc}")
    private String boardDesc;

    /**
     * header
     */
    @ApiModelProperty("header content")
    @Size(min = 0, max = 4000, message = "{tps.board-info.error.size.headerContent}")
    private String headerContent;

    /**
     * footer
     */
    @ApiModelProperty("footer content")
    @Size(min = 0, max = 4000, message = "{tps.board-info.error.size.footerContent}")
    private String footerContent;

    @ApiModelProperty(value = "등록일", hidden = true)
    @Builder.Default
    @DTODateTimeFormat
    private Date regDt = new Date();

    /**
     * 생성자
     */
    @Column(name = "REG_ID")
    private String regId;

    /**
     * 수정일시
     */
    @ApiModelProperty(value = "수정일", hidden = true)
    @Builder.Default
    @DTODateTimeFormat
    private Date modDt = new Date();

    /**
     * 수정자
     */
    @Column(name = "MOD_ID")
    private String modId;
}
