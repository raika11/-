package jmnet.moka.core.tps.mvc.board.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import jmnet.moka.common.data.support.SearchDTO;
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
 * ClassName : BoardInfoDTO
 * Created : 2020-12-16 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-16 16:05
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@ApiModel("게시판 검색 DTO")
public class BoardInfoSearchDTO extends SearchDTO {

    @ApiModelProperty("사용여부")
    private String usedYn;

    @ApiModelProperty("게시판유형(S:서비스 / A:관리자)")
    @NotNull(message = "{tps.board-info.error.pattern.boardType}")
    private BoardTypeCode boardType = BoardTypeCode.A;

    /**
     * 채널타입(예:JPOD)
     */
    @ApiModelProperty("채널타입(예:JPOD)")
    @Size(min = 0, max = 24, message = "{tps.board-info.error.size.channelType}")
    private String channelType;
}
