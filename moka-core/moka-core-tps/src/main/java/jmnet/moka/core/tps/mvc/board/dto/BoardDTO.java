package jmnet.moka.core.tps.mvc.board.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.lang.reflect.Type;
import java.util.List;
import java.util.Set;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.board.dto
 * ClassName : BoardDTO
 * Created : 2020-12-17 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-17 12:03
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@SuperBuilder
@ApiModel("게시물 DTO")
public class BoardDTO {
    public static final Type TYPE = new TypeReference<List<BoardDTO>>() {
    }.getType();

    /**
     * 게시물일련번호
     */
    @ApiModelProperty(hidden = true)
    private Long boardSeq;

    /**
     * 게시판ID
     */
    @ApiModelProperty(hidden = true)
    private Integer boardId;

    /**
     * 부모게시물일련번호
     */
    @ApiModelProperty(value = "부모게시물일련번호", hidden = true)
    @Min(value = 0, message = "{tps.board.error.min.parentBoardSeq}")
    private Long parentBoardSeq;


    /**
     * 등록자명
     */
    @ApiModelProperty("등록자명")
    private String regName;

    /**
     * 뎁스
     */
    @ApiModelProperty(hidden = true)
    @Builder.Default
    private Integer depth = 0;

    /**
     * 들여쓰기
     */
    @ApiModelProperty("들여쓰기")
    @Builder.Default
    private Integer indent = 0;


    /**
     * 조회수
     */
    @ApiModelProperty(hidden = true, value = "조회수")
    @Builder.Default
    private Integer viewCnt = 0;

    /**
     * 추천수
     */
    @ApiModelProperty(hidden = true, value = "추천수")
    @Builder.Default
    private Integer recomCnt = 0;

    /**
     * 비추천수
     */
    @ApiModelProperty(hidden = true, value = "비추천수")
    @Builder.Default
    private Integer decomCnt = 0;

    /**
     * 신고수
     */
    @ApiModelProperty(hidden = true, value = "신고수")
    @Builder.Default
    private Integer declareCnt = 0;

    /**
     * 삭제여부
     */
    @ApiModelProperty(hidden = true, value = "삭제여부")
    @Builder.Default
    private String delYn = MokaConstants.NO;

    /**
     * 등록IP주소
     */
    @ApiModelProperty(hidden = true)
    private String regIp;

    /**
     * 그룹정보
     */
    @ApiModelProperty(hidden = true)
    private BoardInfoDTO boardInfo;

    /**
     * 첨부파일
     */
    @ApiModelProperty(hidden = true)
    private Set<BoardAttachDTO> attaches;

    /**
     * 채널ID(예:JPOD 채널SEQ)
     */
    @ApiModelProperty("채널ID(예:JPOD 채널SEQ)")
    @Min(value = 0, message = "{tps.board.error.min.channelId}")
    private Long channelId = 0l;

    /**
     * 말머리1
     */
    @ApiModelProperty("말머리1")
    @Size(max = 20, message = "{tps.board.error.size.titlePrefix1}")
    private String titlePrefix1;

    /**
     * 말머리2
     */
    @ApiModelProperty("말머리2")
    @Size(max = 20, message = "{tps.board.error.size.titlePrefix2}")
    private String titlePrefix2;

    /**
     * 제목
     */
    @ApiModelProperty("제목")
    @NotEmpty(message = "{tps.board.error.size.title}")
    @Size(max = 300, message = "{tps.board.error.size.title}")
    private String title;


    /**
     * 1:일반 9:공지
     */
    @ApiModelProperty("1:일반 9:공지")
    @Builder.Default
    @Pattern(regexp = "[1|9]{1}$", message = "{tps.board.error.pattern.ordNo}")
    private String ordNo = TpsConstants.BOARD_GENERAL_CONTENT;

    /**
     * 내용
     */
    @ApiModelProperty(value = "내용", required = true)
    @NotEmpty(message = "{tps.board.error.size.content}")
    @Size(min = 1, message = "{tps.board.error.size.content}")
    private String content;


    /**
     * 비밀번호
     */
    @ApiModelProperty("비밀번호")
    private String pwd;

    /**
     * 주소
     */
    @ApiModelProperty("주소")
    @Size(max = 512, message = "{tps.board.error.size.addr}")
    private String addr;
}
