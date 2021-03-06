package jmnet.moka.core.tps.mvc.board.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.Size;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.code.BoardTypeCode;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.common.logger.TpsLogger;
import jmnet.moka.core.tps.mvc.board.dto.BoardInfoDTO;
import jmnet.moka.core.tps.mvc.board.dto.BoardInfoSearchDTO;
import jmnet.moka.core.tps.mvc.board.dto.BoardInfoSimpleDTO;
import jmnet.moka.core.tps.mvc.board.dto.BoardTypeGroupDTO;
import jmnet.moka.core.tps.mvc.board.entity.BoardInfo;
import jmnet.moka.core.tps.mvc.board.service.BoardInfoService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.board.controller
 * ClassName : BoardInfoController
 * Created : 2020-12-17 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-17 11:33
 */
@Slf4j
@RestController
@RequestMapping("/api/board-info")
@Api(tags = {"????????? ?????? API"})
public class BoardInfoRestController extends AbstractCommonController {

    private final BoardInfoService boardInfoService;

    public BoardInfoRestController(BoardInfoService groupService, ModelMapper modelMapper, MessageByLocale messageByLocale, TpsLogger tpsLogger) {
        this.boardInfoService = groupService;
        this.modelMapper = modelMapper;
        this.messageByLocale = messageByLocale;
        this.tpsLogger = tpsLogger;
    }

    /**
     * ?????????????????????
     *
     * @param search ????????????
     * @return ???????????????
     */
    @ApiOperation(value = "????????? ?????? ??????")
    @GetMapping
    public ResponseEntity<?> getBoardInfoList(@SearchParam BoardInfoSearchDTO search) {

        ResultListDTO<BoardInfoDTO> resultListMessage = new ResultListDTO<>();

        // ??????
        search.setDelYn(MokaConstants.NO);
        Page<BoardInfo> returnValue = boardInfoService.findAllBoardInfo(search);

        // ????????? ??????
        List<BoardInfoDTO> boardDtoList = modelMapper.map(returnValue.getContent(), BoardInfoDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(boardDtoList);


        ResultDTO<ResultListDTO<BoardInfoDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ???????????? ???????????? ???????????? ???????????? ?????? ??????
     *
     * @return ???????????????
     */
    @ApiOperation(value = "????????? ?????? ????????? ????????? ?????? ??????")
    @GetMapping("/groups")
    public ResponseEntity<?> getBoardInfoTree() {

        ResultListDTO<BoardInfoDTO> resultListMessage = new ResultListDTO<>();

        // ??????
        BoardInfoSearchDTO search = BoardInfoSearchDTO
                .builder()
                .usedYn(MokaConstants.YES)
                .delYn(MokaConstants.NO)
                .build();

        Page<BoardInfo> resultValue = boardInfoService.findAllBoardInfo(search);
        List<BoardTypeGroupDTO> returnValue = new ArrayList<>();
        if (resultValue.getContent() != null) {
            BoardTypeCode
                    .toList()
                    .stream()
                    .forEach(action -> {
                        String code = (String) action.get("code");
                        BoardTypeGroupDTO boardTypeGroupDTO = BoardTypeGroupDTO
                                .builder()
                                .boardType((String) action.get("code"))
                                .boardTypeName((String) action.get("name"))
                                .build();
                        resultValue
                                .getContent()
                                .forEach(boardInfo -> {
                                    if (boardInfo
                                            .getBoardType()
                                            .getCode()
                                            .equals(code)) {
                                        boardTypeGroupDTO.addBoardInfoList(modelMapper.map(boardInfo, BoardInfoSimpleDTO.class));
                                    }
                                });
                        returnValue.add(boardTypeGroupDTO);
                    });
        }
        ResultDTO<List<BoardTypeGroupDTO>> resultDto = new ResultDTO<>(returnValue);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ??????????????? ??????
     *
     * @param request ??????
     * @param boardId ?????????????????? (??????)
     * @return ???????????????
     * @throws NoDataException ????????? ????????? ??????
     */
    @ApiOperation(value = "????????? ??????")
    @GetMapping("/{boardId}")
    public ResponseEntity<?> getBoardInfo(HttpServletRequest request,
            @ApiParam("???????????????") @PathVariable("boardId") @Size(min = 1, max = 3, message = "{tps.board-info.error.pattern.boardId}") Integer boardId)
            throws NoDataException {

        String message = msg("tps.common.error.no-data", request);
        BoardInfo group = boardInfoService
                .findBoardInfoById(boardId)
                .orElseThrow(() -> new NoDataException(message));

        BoardInfoDTO dto = modelMapper.map(group, BoardInfoDTO.class);


        tpsLogger.success(ActionType.SELECT);

        ResultDTO<BoardInfoDTO> resultDto = new ResultDTO<>(dto);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }


    /**
     * ??????
     *
     * @param request      ??????
     * @param boardInfoDTO ????????? ???????????????
     * @return ????????? ???????????????
     * @throws InvalidDataException ????????? ????????? ??????
     * @throws Exception            ????????????
     */
    @ApiOperation(value = "????????? ??????")
    @PostMapping
    public ResponseEntity<?> postBoardInfo(HttpServletRequest request, @Valid BoardInfoDTO boardInfoDTO)
            throws InvalidDataException, Exception {

        // BoardInfoDTO -> BoardInfo ??????
        BoardInfo group = modelMapper.map(boardInfoDTO, BoardInfo.class);

        // jpod ???????????? 1??????....
        if (TpsConstants.BOARD_JPOD.equals(boardInfoDTO.getChannelType()) && boardInfoService
                .findAllBoardInfoByChannelType(TpsConstants.BOARD_JPOD)
                .size() > 0) {
            throw new InvalidDataException(msg("tps.board-info.error.jpod.exist"));
        }

        try {


            // insert
            BoardInfo returnValue = boardInfoService.insertBoardInfo(group);


            // ????????????
            BoardInfoDTO dto = modelMapper.map(returnValue, BoardInfoDTO.class);
            ResultDTO<BoardInfoDTO> resultDto = new ResultDTO<>(dto, msg("tps.board-info.success.save"));

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success(ActionType.INSERT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT BOARDINFO]", e);
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.board-info.error.save", request), e);
        }
    }

    /**
     * ??????
     *
     * @param request      ??????
     * @param boardId      ??????????????????
     * @param boardInfoDTO ????????? ???????????????
     * @return ????????? ???????????????
     * @throws Exception ?????? ?????? ??????
     */
    @ApiOperation(value = "????????? ??????")
    @PutMapping("/{boardId}")
    public ResponseEntity<?> putBoardInfo(HttpServletRequest request,
            @ApiParam("???????????????") @PathVariable("boardId") @Min(value = 1, message = "{tps.board-info.error.pattern.boardId}") Integer boardId,
            @Valid BoardInfoDTO boardInfoDTO)
            throws Exception {

        // BoardInfoDTO -> BoardInfo ??????
        String infoMessage = msg("tps.common.error.no-data", request);
        BoardInfo newBoardInfo = modelMapper.map(boardInfoDTO, BoardInfo.class);
        newBoardInfo.setBoardId(boardId);

        // ????????? ????????? ??????
        boardInfoService
                .findBoardInfoById(newBoardInfo.getBoardId())
                .orElseThrow(() -> new NoDataException(infoMessage));

        // jpod ???????????? 1??????....
        if (TpsConstants.BOARD_JPOD.equals(boardInfoDTO.getChannelType())) {
            List<BoardInfo> jpodBoardList = boardInfoService.findAllBoardInfoByChannelType(TpsConstants.BOARD_JPOD);
            if (jpodBoardList != null && jpodBoardList.size() > 0) { // jpod ???????????? ?????? ??????
                // jpod ???????????? ????????? ?????????????????? ???????????? jpod ??????????????? ??????????????? ??? ??????
                if (jpodBoardList
                        .stream()
                        .filter(boardInfo -> boardInfo
                                .getBoardId()
                                .equals(boardId))
                        .count() == 0) {
                    throw new InvalidDataException(msg("tps.board-info.error.jpod.exist"));
                }
            }
        }

        try {
            // update
            BoardInfo returnValue = boardInfoService.updateBoardInfo(newBoardInfo);

            // ????????????
            BoardInfoDTO dto = modelMapper.map(returnValue, BoardInfoDTO.class);
            ResultDTO<BoardInfoDTO> resultDto = new ResultDTO<>(dto, msg("tps.board-info.success.save"));

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success(ActionType.UPDATE);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE BOARDINFO]", e);
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.UPDATE, e);
            throw new Exception(msg("tps.board-info.error.save", request), e);
        }
    }

    /**
     * ????????? ??? ?????? ?????? ?????? ??????
     *
     * @param boardId ?????????ID
     * @return ??????????????? ?????? ??????
     */
    @ApiOperation(value = "????????? ??? ?????? ????????? ?????? ??????")
    @GetMapping("/{boardId}/has-contents")
    public ResponseEntity<?> hasContent(
            @ApiParam("???????????????") @PathVariable("boardId") @Size(min = 1, max = 3, message = "{tps.board-info.error.pattern.boardId}") Integer boardId) {

        boolean exists = boardInfoService.hasContents(boardId);
        String message = exists ? msg("tps.board-info.success.select.exist-boardContent") : "";

        // ????????????
        ResultDTO<Boolean> resultDto = new ResultDTO<>(exists, message);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * ??????
     *
     * @param request ??????
     * @param boardId ?????? ??? ?????????????????? (??????)
     * @return ??????????????????
     * @throws InvalidDataException ????????????????????????
     * @throws NoDataException      ?????? ??? ????????? ??????
     * @throws Exception            ??? ??? ????????????
     */
    @ApiOperation(value = "????????? ??????")
    @DeleteMapping("/{boardId}")
    public ResponseEntity<?> deleteBoardInfo(HttpServletRequest request,
            @ApiParam("???????????????") @PathVariable("boardId") @Size(min = 1, max = 3, message = "{tps.board-info.error.pattern.boardId}") Integer boardId)
            throws InvalidDataException, NoDataException, Exception {


        // ????????? ????????? ??????
        String noContentMessage = msg("tps.common.error.no-data", request);
        BoardInfo boardInfo = boardInfoService
                .findBoardInfoById(boardId)
                .orElseThrow(() -> new NoDataException(noContentMessage));

        // ?????? ????????? ??????
        if (boardInfoService.hasContents(boardId)) {
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.fail(ActionType.DELETE, msg("tps.board-info.error.delete.exist-boardContent", request));
            throw new InvalidDataException(msg("tps.board-info.error.delete.exist-boardContent", request));
        }

        try {
            // ??????
            boardInfo.setUsedYn(MokaConstants.NO);
            boardInfo.setDelYn(MokaConstants.YES);
            boardInfoService.delBoardInfo(boardInfo);
            //boardInfoService.deleteBoardInfo(boardInfo);

            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.success(ActionType.DELETE);

            // ????????????
            ResultDTO<Boolean> resultDto = new ResultDTO<>(true, msg("tps.common.success.delete"));
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE BOARDINFO] boardId: {} {}", boardId, e.getMessage());
            // ?????? ????????? ?????? ?????? ??????
            tpsLogger.error(ActionType.DELETE, e.toString());
            throw new Exception(msg("tps.board-info.error.delete", request), e);
        }
    }


}
