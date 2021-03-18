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
@Api(tags = {"게시판 정보 API"})
public class BoardInfoRestController extends AbstractCommonController {

    private final BoardInfoService boardInfoService;

    public BoardInfoRestController(BoardInfoService groupService, ModelMapper modelMapper, MessageByLocale messageByLocale, TpsLogger tpsLogger) {
        this.boardInfoService = groupService;
        this.modelMapper = modelMapper;
        this.messageByLocale = messageByLocale;
        this.tpsLogger = tpsLogger;
    }

    /**
     * 게시판목록조회
     *
     * @param search 검색조건
     * @param search 검색조건
     * @return 게시판목록
     */
    @ApiOperation(value = "게시판 목록 조회")
    @GetMapping
    public ResponseEntity<?> getBoardInfoList(@SearchParam BoardInfoSearchDTO search) {

        ResultListDTO<BoardInfoDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<BoardInfo> returnValue = boardInfoService.findAllBoardInfo(search);

        // 리턴값 설정
        List<BoardInfoDTO> boardDtoList = modelMapper.map(returnValue.getContent(), BoardInfoDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(boardDtoList);


        ResultDTO<ResultListDTO<BoardInfoDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 사용중인 게시판을 유형별로 그룹화한 목록 조회
     *
     * @return 게시판목록
     */
    @ApiOperation(value = "게시판 유형 그룹별 게시판 목록 조회")
    @GetMapping("/groups")
    public ResponseEntity<?> getBoardInfoTree() {

        ResultListDTO<BoardInfoDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        BoardInfoSearchDTO search = BoardInfoSearchDTO
                .builder()
                .usedYn(MokaConstants.YES)
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
     * 게시판정보 조회
     *
     * @param request 요청
     * @param boardId 게시판아이디 (필수)
     * @return 게시판정보
     * @throws NoDataException 게시판 정보가 없음
     */
    @ApiOperation(value = "게시판 조회")
    @GetMapping("/{boardId}")
    public ResponseEntity<?> getBoardInfo(HttpServletRequest request,
            @ApiParam("게시판코드") @PathVariable("boardId") @Size(min = 1, max = 3, message = "{tps.board-info.error.pattern.boardId}") Integer boardId)
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
     * 등록
     *
     * @param request  요청
     * @param groupDTO 등록할 게시판정보
     * @return 등록된 게시판정보
     * @throws InvalidDataException 데이타 유효성 오류
     * @throws Exception            예외처리
     */
    @ApiOperation(value = "게시판 등록")
    @PostMapping
    public ResponseEntity<?> postBoardInfo(HttpServletRequest request, @Valid BoardInfoDTO groupDTO)
            throws InvalidDataException, Exception {

        // BoardInfoDTO -> BoardInfo 변환
        BoardInfo group = modelMapper.map(groupDTO, BoardInfo.class);

        try {
            // insert
            BoardInfo returnValue = boardInfoService.insertBoardInfo(group);


            // 결과리턴
            BoardInfoDTO dto = modelMapper.map(returnValue, BoardInfoDTO.class);
            ResultDTO<BoardInfoDTO> resultDto = new ResultDTO<>(dto, msg("tps.board-info.success.save"));

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.INSERT);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO INSERT BOARDINFO]", e);
            // 액션 로그에 오류 내용 출력
            tpsLogger.error(ActionType.INSERT, e);
            throw new Exception(msg("tps.board-info.error.save", request), e);
        }
    }

    /**
     * 수정
     *
     * @param request  요청
     * @param boardId  게시판아이디
     * @param groupDTO 수정할 게시판정보
     * @return 수정된 게시판정보
     * @throws Exception 그외 모든 에러
     */
    @ApiOperation(value = "게시판 수정")
    @PutMapping("/{boardId}")
    public ResponseEntity<?> putBoardInfo(HttpServletRequest request,
            @ApiParam("게시판코드") @PathVariable("boardId") @Min(value = 1, message = "{tps.board-info.error.pattern.boardId}") Integer boardId,
            @Valid BoardInfoDTO groupDTO)
            throws Exception {

        // BoardInfoDTO -> BoardInfo 변환
        String infoMessage = msg("tps.common.error.no-data", request);
        BoardInfo newBoardInfo = modelMapper.map(groupDTO, BoardInfo.class);
        newBoardInfo.setBoardId(boardId);

        // 오리진 데이터 조회
        boardInfoService
                .findBoardInfoById(newBoardInfo.getBoardId())
                .orElseThrow(() -> new NoDataException(infoMessage));



        try {
            // update
            BoardInfo returnValue = boardInfoService.updateBoardInfo(newBoardInfo);

            // 결과리턴
            BoardInfoDTO dto = modelMapper.map(returnValue, BoardInfoDTO.class);
            ResultDTO<BoardInfoDTO> resultDto = new ResultDTO<>(dto, msg("tps.board-info.success.save"));

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.UPDATE);

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO UPDATE BOARDINFO]", e);
            // 액션 로그에 에러 로그 출력
            tpsLogger.error(ActionType.UPDATE, e);
            throw new Exception(msg("tps.board-info.error.save", request), e);
        }
    }

    /**
     * 게시판 내 속한 멤버 존재 여부
     *
     * @param boardId 게시판ID
     * @return 관련아이템 존재 여부
     */
    @ApiOperation(value = "게시판 내 속한 게시글 존재 여부")
    @GetMapping("/{boardId}/has-contents")
    public ResponseEntity<?> hasContent(
            @ApiParam("게시판코드") @PathVariable("boardId") @Size(min = 1, max = 3, message = "{tps.board-info.error.pattern.boardId}") Integer boardId) {

        boolean exists = boardInfoService.hasContents(boardId);
        String message = exists ? msg("tps.board-info.success.select.exist-board") : "";

        // 결과리턴
        ResultDTO<Boolean> resultDto = new ResultDTO<>(exists, message);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 삭제
     *
     * @param request 요청
     * @param boardId 삭제 할 게시판아이디 (필수)
     * @return 삭제성공여부
     * @throws InvalidDataException 데이타유효성오류
     * @throws NoDataException      삭제 할 게시판 없음
     * @throws Exception            그 외 에러처리
     */
    @ApiOperation(value = "게시판 삭제")
    @DeleteMapping("/{boardId}")
    public ResponseEntity<?> deleteBoardInfo(HttpServletRequest request,
            @ApiParam("게시판코드") @PathVariable("boardId") @Size(min = 1, max = 3, message = "{tps.board-info.error.pattern.boardId}") Integer boardId)
            throws InvalidDataException, NoDataException, Exception {


        // 게시판 데이터 조회
        String noContentMessage = msg("tps.common.error.no-data", request);
        BoardInfo boardInfo = boardInfoService
                .findBoardInfoById(boardId)
                .orElseThrow(() -> new NoDataException(noContentMessage));

        // 관련 데이터 조회
        if (boardInfoService.hasContents(boardId)) {
            // 액션 로그에 실패 로그 출력
            tpsLogger.fail(ActionType.DELETE, msg("tps.board-info.error.delete.exist-boardContent", request));
            throw new InvalidDataException(msg("tps.board-info.error.delete.exist-boardContent", request));
        }

        try {
            // 삭제
            boardInfoService.deleteBoardInfo(boardInfo);

            // 액션 로그에 성공 로그 출력
            tpsLogger.success(ActionType.DELETE);

            // 결과리턴
            ResultDTO<Boolean> resultDto = new ResultDTO<>(true, msg("tps.common.success.delete"));
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO DELETE BOARDINFO] boardId: {} {}", boardId, e.getMessage());
            // 액션 로그에 실패 로그 출력
            tpsLogger.error(ActionType.DELETE, e.toString());
            throw new Exception(msg("tps.board-info.error.delete", request), e);
        }
    }


}
