package jmnet.moka.core.tps.mvc.board.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.lang.reflect.Type;
import java.util.List;
import javax.persistence.Column;
import jmnet.moka.core.common.MokaConstants;
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
 * ClassName : BoardInfo
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
    private Integer boardId;

    /**
     * 게시판명
     */
    @ApiModelProperty("게시판명")
    private String boardName;

    /**
     * 게시판유형(S:서비스 / A:관리자)
     */
    @ApiModelProperty("게시판유형(S:서비스 / A:관리자)")
    @Builder.Default
    private String boardType = "A";

    /**
     * 사용여부
     */
    @ApiModelProperty("사용여부")
    @Builder.Default
    private String usedYn = MokaConstants.YES;

    /**
     * 말머리1
     */
    @ApiModelProperty("말머리1")
    @Column(name = "TITLE_PREFIX1")
    private String titlePrefix1;

    /**
     * 말머리2
     */
    @ApiModelProperty("말머리2")
    @Column(name = "TITLE_PREFIX2")
    private String titlePrefix2;

    /**
     * 글쓰기 권한(0:모두 1:회원 9:관리자)
     */
    @ApiModelProperty("글쓰기 권한(0:모두 1:회원 9:관리자)")
    @Builder.Default
    private String insLevel = "9";

    /**
     * 조회 권한(0:모두 1:회원 9:관리자)
     */
    @ApiModelProperty("조회 권한(0:모두 1:회원 9:관리자)")
    @Builder.Default
    private String viewLevel = "0";

    /**
     * 답변글 작성권한(0:모두 1:회원 9:관리자)
     */
    @ApiModelProperty("답변글 작성권한(0:모두 1:회원 9:관리자)")
    @Builder.Default
    private String answLevel = "9";

    /**
     * 댓글 작성권한(0:모두 1:회원)
     */
    @ApiModelProperty("댓글 작성권한(0:모두 1:회원)")
    @Builder.Default
    private String replyLevel = "1";

    /**
     * 에디터여부
     */
    @ApiModelProperty("에디터여부")
    @Builder.Default
    private String editorYn = MokaConstants.NO;

    /**
     * 답글여부
     */
    @ApiModelProperty("답글여부")
    @Builder.Default
    private String answYn = MokaConstants.NO;

    /**
     * 댓글여부
     */
    @ApiModelProperty("댓글여부")
    @Builder.Default
    private String replyYn = MokaConstants.NO;

    /**
     * 파일업로드여부
     */
    @ApiModelProperty("파일업로드여부")
    @Builder.Default
    private String fileYn = MokaConstants.YES;

    /**
     * 허용파일개수
     */
    @ApiModelProperty("허용파일개수")
    @Builder.Default
    private Integer allowFileCnt = 5;

    /**
     * 허용되는 파일크기(MB)
     */
    @ApiModelProperty("허용되는 파일크기(MB)")
    @Builder.Default
    private Integer allowFileSize = 10;

    /**
     * 허용되는 파일확장자(;로 구분)
     */
    @ApiModelProperty("허용되는 파일확장자(;로 구분)")
    @Builder.Default
    private String allowFileExt = "zip;xls;xlsx;ppt;doc;hwp;jpg;png;gif;";

    /**
     * 추천여부 0:사용안함 1:추천/비추천 2:추천만
     */
    @ApiModelProperty("추천여부 0:사용안함 1:추천/비추천 2:추천만")
    private String recomFlag;

    /**
     * 신고여부
     */
    @ApiModelProperty("신고여부")
    private String declareYn;

    /**
     * 캡차여부
     */
    @ApiModelProperty("캡차여부")
    private String captchaYn;

    /**
     * 채널타입(예:JPOD)
     */
    @ApiModelProperty("채널타입(예:JPOD)")
    private String channelType;

    /**
     * 게시판설명
     */
    @ApiModelProperty("게시판설명")
    private String boardDesc;
}
