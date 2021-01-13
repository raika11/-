package jmnet.moka.core.tps.mvc.poll.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;
import jmnet.moka.common.data.support.SearchParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.logger.LoggerCodes.ActionType;
import jmnet.moka.core.tps.common.controller.AbstractCommonController;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.poll.code.PollCode.PollStatusCode;
import jmnet.moka.core.tps.mvc.poll.dto.TrendpollDTO;
import jmnet.moka.core.tps.mvc.poll.dto.TrendpollDetailDTO;
import jmnet.moka.core.tps.mvc.poll.dto.TrendpollSearchDTO;
import jmnet.moka.core.tps.mvc.poll.entity.Trendpoll;
import jmnet.moka.core.tps.mvc.poll.entity.TrendpollDetail;
import jmnet.moka.core.tps.mvc.poll.service.TrendpollService;
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

        ResultDTO<TrendpollDTO> resultDto = new ResultDTO<>(modelMapper.map(trendpoll, TrendpollDTO.class), msg("tps.common.success.insert"));

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

        ResultDTO<TrendpollDTO> resultDto = new ResultDTO<>(modelMapper.map(trendpoll, TrendpollDTO.class), msg("tps.common.success.update"));

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
            @ApiParam("사용여부") @Pattern(regexp = "[Y|N]$", message = "{tps.common.error.pattern.usedYn}")
            @RequestParam(value = "usedYn", defaultValue = MokaConstants.YES) String usedYn)
            throws NoDataException {

        Trendpoll trendpoll = trendpollService
                .findTrendpollBySeq(pollSeq)
                .orElseThrow(() -> new NoDataException(msg("tps.common.error.no-data")));

        long result = trendpollService.updateTrendpollStatus(pollSeq, PollStatusCode.T);

        tpsLogger.success(ActionType.UPDATE);

        ResultDTO<TrendpollDTO> resultDto = new ResultDTO<>(modelMapper.map(result, TrendpollDTO.class), msg("tps.common.success.update"));

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

}
