package jmnet.moka.core.tps.mvc.board.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.util.List;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
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
public class BoardSaveDTO {

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
    @ApiModelProperty(value = "제목", required = true)
    @NotEmpty(message = "{tps.board.error.size.title}")
    @Size(max = 300, message = "{tps.board.error.size.title}")
    private String title;


    /**
     * 뎁스
     */
    @ApiModelProperty(hidden = true, required = true)
    @Builder.Default
    private Integer depth = 0;

    /**
     * 들여쓰기
     */
    @ApiModelProperty(value = "들여쓰기", required = true)
    @Builder.Default
    private Integer indent = 0;

    /**
     * 1:일반 9:공지
     */
    @ApiModelProperty(value = "1:일반 9:공지", required = true)
    @Builder.Default
    @Pattern(regexp = "[1|9]{1}$", message = "{tps.board.error.pattern.ordNo}")
    private String ordNo = "1";


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


    /**
     * 첨부파일
     */
    @ApiModelProperty("첨부파일")
    private List<BoardAttachSaveDTO> attaches;



    @ApiModelProperty("등록구분(M:회원,A:관리자)")
    private String regDiv;

    @ApiModelProperty("수정구분(M:회원,A:관리자)")
    private String modDiv;
}
