package jmnet.moka.core.tps.mvc.poll.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.common.utils.dto.ResultMapDTO;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.poll.code.PollCode.PollStatCode;
import jmnet.moka.core.tps.mvc.poll.code.PollCode.PollStatusCode;
import jmnet.moka.core.tps.mvc.poll.dto.TrendpollDTO;
import jmnet.moka.core.tps.mvc.poll.dto.TrendpollDetailDTO;
import jmnet.moka.core.tps.mvc.poll.dto.TrendpollSearchDTO;
import jmnet.moka.core.tps.mvc.poll.dto.TrendpollStatSearchDTO;
import jmnet.moka.core.tps.mvc.poll.entity.Trendpoll;
import jmnet.moka.core.tps.mvc.poll.entity.TrendpollDetail;
import jmnet.moka.core.tps.mvc.poll.service.TrendpollService;
import jmnet.moka.core.tps.mvc.poll.vo.TrendpollStatVO;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.poll.controller
 * ClassName : TrendpollRestController
 * Created : 2021-01-13 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-13 09:42
 */
@RestController
@RequestMapping("/api/polls")
@Api(tags = {"투표 API"})
public class TrendpollRestController extends AbstractCommonController {
    private final ModelMapper modelMapper;

    private final TrendpollService trendpollService;

    public TrendpollRestController(ModelMapper modelMapper, TrendpollService trendpollService) {
        this.modelMapper = modelMapper;
        this.trendpollService = trendpollService;
    }


    /**
     * 목록조회
     *
     * @param search 검색조건
     * @return 목록
     */
    @ApiOperation(value = "투표 목록 조회")
    @GetMapping
    public ResponseEntity<?> getTrendpollList(@SearchParam TrendpollSearchDTO search) {

        ResultListDTO<TrendpollDTO> resultListMessage = new ResultListDTO<>();

        Page<Trendpoll> trendpolls = trendpollService.findAllTrendpoll(search);
        resultListMessage.setList(modelMapper.map(trendpolls.getContent(), TrendpollDTO.TYPE));
        resultListMessage.setTotalCnt(trendpolls.getTotalElements());

        tpsLogger.success(ActionType.SELECT);

        ResultDTO<ResultListDTO<TrendpollDTO>> resultDto = new ResultDTO<>(resultListMessage);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 목록조회
     *
     * @param pollSeq 투표일련번호
     * @return 투표정보
     */
    @ApiOperation(value = "투표 정보 조회")
    @GetMapping("/{pollSeq}")
    public ResponseEntity<?> getTrendpoll(
            @ApiParam("투표 일련번호") @PathVariable("pollSeq") @Min(value = 0, message = "{tps.poll.error.pattern.pollSeq}") Long pollSeq)
            throws NoDataException {

        TrendpollDetail trendpoll = trendpollService
                .findTrendpollDetailBySeq(pollSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        tpsLogger.success(ActionType.SELECT);

        ResultDTO<TrendpollDetailDTO> resultDto = new ResultDTO<>(modelMapper.map(trendpoll, TrendpollDetailDTO.class));

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 등록
     *
     * @param trendpollSaveDTO 등록할 정보
     * @return 등록된 정보
     */
    @ApiOperation(value = "투표 등록")
    @PostMapping
    public ResponseEntity<?> postTrendpoll(@Valid TrendpollDetailDTO trendpollSaveDTO) {

        TrendpollDetail trendpoll = modelMapper.map(trendpollSaveDTO, TrendpollDetail.class);
        trendpoll = trendpollService.insertTrendpoll(trendpoll);

        ResultDTO<TrendpollDetailDTO> resultDto =
                new ResultDTO<>(modelMapper.map(trendpoll, TrendpollDetailDTO.class), msg("tps.common.success.insert"));

        tpsLogger.success(ActionType.INSERT);

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 투표 정보 수정
     *
     * @param trendpollSaveDTO 투표 정보
     * @param pollSeq          투표 일련번호
     * @return 등록된 정보
     */
    @ApiOperation(value = "투표 수정")
    @PutMapping("/{pollSeq}")
    public ResponseEntity<?> putTrendpoll(
            @ApiParam("투표 일련번호") @PathVariable("pollSeq") @Min(value = 1, message = "{tps.poll.error.pattern.pollSeq}") Long pollSeq,
            @Valid TrendpollDetailDTO trendpollSaveDTO)
            throws NoDataException {

        trendpollService
                .findTrendpollBySeq(pollSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        TrendpollDetail trendpoll = modelMapper.map(trendpollSaveDTO, TrendpollDetail.class);
        trendpoll.setPollSeq(pollSeq);
        trendpoll = trendpollService.updateTrendpoll(trendpoll);

        tpsLogger.success(ActionType.UPDATE);

        ResultDTO<TrendpollDetailDTO> resultDto =
                new ResultDTO<>(modelMapper.map(trendpoll, TrendpollDetailDTO.class), msg("tps.common.success.update"));

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 투표 상태 변경
     *
     * @param pollSeq 투표 일련번호
     * @return 성공여부
     */
    @ApiOperation(value = "투표 정보 삭제/복원")
    @PutMapping("/{pollSeq}/used")
    public ResponseEntity<?> putTrendpollUsedYn(
            @ApiParam("투표 일련번호") @PathVariable("pollSeq") @Min(value = 1, message = "{tps.poll.error.pattern.pollSeq}") Long pollSeq,
            @ApiParam("사용여부") @NotNull(message = "{tps.poll.error.notnull.status}") @RequestParam(value = "status") PollStatusCode status)
            throws NoDataException {

        Trendpoll trendpoll = trendpollService
                .findTrendpollBySeq(pollSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        long result = trendpollService.updateTrendpollStatus(pollSeq, status);

        tpsLogger.success(ActionType.UPDATE);

        ResultDTO<TrendpollDTO> resultDto = new ResultDTO<>(modelMapper.map(result, TrendpollDTO.class), msg("tps.common.success.update"));

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 투표 현황 목록 조회
     *
     * @param search 검색조건
     * @return 목록
     */
    @ApiOperation(value = "투표 현황 목록 조회")
    @GetMapping("/{pollSeq}/stats")
    public ResponseEntity<?> getTrendpollStatMap(
            @ApiParam("투표 일련번호") @PathVariable("pollSeq") @Min(value = 1, message = "{tps.poll.error.pattern.pollSeq}") Long pollSeq,
            @SearchParam TrendpollStatSearchDTO search) {

        ResultListDTO<TrendpollDTO> resultListMessage = new ResultListDTO<>();

        List<List<TrendpollStatVO>> trendpolls = trendpollService.findAllTrendpollVoteStat(search);

        ResultMapDTO resultMapDTO = new ResultMapDTO(HttpStatus.OK);
        resultMapDTO.addBodyAttribute(PollStatCode.A.getCode(), trendpolls != null && trendpolls.size() > 0 ? trendpolls.get(0) : null);
        resultMapDTO.addBodyAttribute(PollStatCode.D.getCode(), trendpolls != null && trendpolls.size() > 1 ? trendpolls.get(1) : null);
        resultMapDTO.addBodyAttribute(PollStatCode.T.getCode(), trendpolls != null && trendpolls.size() > 2 ? trendpolls.get(2) : null);

        tpsLogger.success(ActionType.SELECT);

        return new ResponseEntity<>(resultMapDTO, HttpStatus.OK);
    }
}
