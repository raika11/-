package jmnet.moka.core.tps.mvc.editlog.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.List;
import javax.validation.constraints.Size;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.mvc.editlog.dto.EditLogDTO;
import jmnet.moka.core.tps.mvc.editlog.dto.EditLogSearchDTO;
import jmnet.moka.core.tps.mvc.editlog.entity.EditLog;
import jmnet.moka.core.tps.mvc.editlog.service.EditLogService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 * 편집로그 관리 컨트롤러
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.editlog.controller
 * ClassName : EditLogRestController
 * Created : 2021-01-20 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-20 10:32
 */
@RestController
@RequestMapping("/api/edit-logs")
@Slf4j
@Api(tags = {"편집로그 API"})
public class EditLogRestController extends AbstractCommonController {

    private final EditLogService editLogService;

    public EditLogRestController(EditLogService editLogService) {
        this.editLogService = editLogService;
    }

    /**
     * 편집로그목록조회
     *
     * @param search 검색조건
     * @return 편집로그목록
     */
    @ApiOperation(value = "편집로그 목록 조회")
    @GetMapping
    public ResponseEntity<?> getEditLogList(@SearchParam EditLogSearchDTO search) {

        ResultListDTO<EditLogDTO> resultListMessage = new ResultListDTO<>();

        // 조회
        Page<EditLog> returnValue = editLogService.findAllEditLog(search);

        // 리턴값 설정
        List<EditLogDTO> quizList = modelMapper.map(returnValue.getContent(), EditLogDTO.TYPE);
        resultListMessage.setTotalCnt(returnValue.getTotalElements());
        resultListMessage.setList(quizList);


        ResultDTO<ResultListDTO<EditLogDTO>> resultDto = new ResultDTO<>(resultListMessage);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }



    /**
     * 편집로그정보 조회
     *
     * @param seqNo 편집로그일련번호 (필수)
     * @return 편집로그정보
     * @throws NoDataException 편집로그 정보가 없음
     */
    @ApiOperation(value = "편집로그 조회")
    @GetMapping("/{seqNo}")
    public ResponseEntity<?> getEditLog(
            @ApiParam("편집로그 일련번호") @PathVariable("seqNo") @Size(min = 1, message = "{tps.quiz.error.pattern.seqNo}") Long seqNo)
            throws NoDataException {

        String message = msg("tps.common.error.no-data");
        EditLog quiz = editLogService
                .findEditLogBySeq(seqNo)
                .orElseThrow(() -> new NoDataException(message));

        EditLogDTO dto = modelMapper.map(quiz, EditLogDTO.class);

        tpsLogger.success(ActionType.SELECT);

        ResultDTO<EditLogDTO> resultDto = new ResultDTO<>(dto);
        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
}
