package jmnet.moka.core.tps.mvc.board.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.mvc.board.dto.BoardDTO;
import jmnet.moka.core.tps.mvc.board.dto.JpodNoticeSearchDTO;
import jmnet.moka.core.tps.mvc.board.entity.JpodBoard;
import jmnet.moka.core.tps.mvc.board.service.BoardInfoService;
import jmnet.moka.core.tps.mvc.board.service.BoardService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.board.controller
 * ClassName : BoardNoticeRestController
 * Created : 2020-12-17 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-17 11:33
 */
@Slf4j
@RestController
@RequestMapping("/api/boards/jpod-notices")
@Api(tags = {"J팟 공지사항 API"})
public class BoardNoticeRestController extends AbstractCommonController {

    private final BoardService boardService;

    public BoardNoticeRestController(BoardService boardService, ModelMapper modelMapper, MessageByLocale messageByLocale, TpsLogger tpsLogger,
            BoardInfoService boardInfoService) {
        this.boardService = boardService;
        this.modelMapper = modelMapper;
        this.messageByLocale = messageByLocale;
        this.tpsLogger = tpsLogger;
    }

    /**
     * Jpod 공지사항 목록 조회
     *
     * @param search 검색조건
     * @return 게시판목록
     */
    @ApiOperation(value = "J팟 공지사항 목록 조회")
    @GetMapping
    public ResponseEntity<?> getJpodNoticeList(@SearchParam JpodNoticeSearchDTO search) {

        ResultListDTO<BoardDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<JpodBoard> returnValue = boardService.findAllJpodNotice(search);

        // 리턴값 설정
        List<BoardDTO> boardDtoList = modelMapper.map(returnValue.getContent(), BoardDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(boardDtoList);


        ResultDTO<ResultListDTO<BoardDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }



}
