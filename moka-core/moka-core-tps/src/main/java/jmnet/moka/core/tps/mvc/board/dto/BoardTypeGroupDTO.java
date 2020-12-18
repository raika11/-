package jmnet.moka.core.tps.mvc.board.dto;

import io.swagger.annotations.ApiModel;
import java.util.ArrayList;
import java.util.List;
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
 * @since 2020-12-18 12:13
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@ApiModel("게시판 Tree DTO")
public class BoardTypeGroupDTO {
    /**
     * 게시판 유형
     */
    String boardType;

    /**
     * 게시판 유형명
     */
    String boardTypeName;

    /**
     * 게시판 목록
     */
    @Builder.Default
    List<BoardInfoSimpleDTO> boardInfoList = new ArrayList<>();

    public void addBoardInfoList(BoardInfoSimpleDTO boardInfoSimple) {
        boardInfoList.add(boardInfoSimple);
    }
}
