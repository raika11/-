package jmnet.moka.core.tps.mvc.board.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import jmnet.moka.core.tps.common.code.BoardTypeCode;
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
 * ClassName : BoardTree
 * Created : 2020-12-18 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-18 12:11
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@ApiModel("게시판 정보 Simple DTO")
public class BoardInfoSimpleDTO {
    /**
     * 게시판ID
     */
    @ApiModelProperty(hidden = true)
    @Min(value = 0, message = "{tps.board-info.error.min.boardId}")
    private Integer boardId;

    /**
     * 게시판명
     */
    @ApiModelProperty("게시판명")
    @Size(min = 2, max = 100, message = "{tps.board-info.error.size.boardName}")
    private String boardName;

    /**
     * 게시판유형(S:서비스 / A:관리자)
     */
    @ApiModelProperty("게시판유형(S:서비스 / A:관리자)")
    @Builder.Default
    @NotNull(message = "{tps.board-info.error.pattern.boardType}")
    private BoardTypeCode boardType = BoardTypeCode.A;


}
