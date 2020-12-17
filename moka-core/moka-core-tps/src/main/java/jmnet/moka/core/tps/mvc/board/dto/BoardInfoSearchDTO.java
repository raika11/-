package jmnet.moka.core.tps.mvc.board.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import jmnet.moka.common.data.support.SearchDTO;
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
}
