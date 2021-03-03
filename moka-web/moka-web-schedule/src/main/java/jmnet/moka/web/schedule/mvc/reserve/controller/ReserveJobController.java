package jmnet.moka.web.schedule.mvc.reserve.controller;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.core.common.exception.DuplicateIdException;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.web.schedule.config.PropertyHolder;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContentHistory;
import jmnet.moka.web.schedule.mvc.gen.service.GenContentService;
import jmnet.moka.web.schedule.mvc.reserve.dto.ReserveJobDTO;
import jmnet.moka.web.schedule.support.reserve.ReserveJobHandler;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 * 예약 작업 Controller
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.schedule.controller
 * ClassName : ReserveJobController
 * Created : 2021-02-05 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-05 17:40
 */
@RestController
@RequestMapping("/api/reserve")
@Slf4j
@Validated
public class ReserveJobController {

    @Autowired
    private ReserveJobHandler handler;

    @Autowired
    private GenContentService jobContentService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private PropertyHolder propertyHolder;


    /**
     * 예약 Job 추가
     *
     * @param reserveJob job 일련번호
     * @return 추가 결과
     * @throws MokaException 일반적인 오류 처리
     */
    @ApiOperation(value = "신규 Job 추가")
    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> postJob(@Valid ReserveJobDTO reserveJob) {
        boolean success = false;
        log.debug("jobCd : " + reserveJob.getJobCd());
        log.debug("reserveJob : " + reserveJob.getJobTaskId());
        try {
            if (jobContentService.countGenContentHistoryByJobTaskId(reserveJob.getJobTaskId()) > 0) {
                throw new DuplicateIdException("동일 예약 작업 ID 존재");
            }

            if (McpDate.term(reserveJob.getReserveDt(), McpDate.minutePlus(McpDate.now(), propertyHolder.getPermitLimitMinutes())) < 0) {
                throw new MokaException("예약작업 등록 처리 가능 시간 초과");
            }

            GenContent genContent = jobContentService
                    .findJobContentByJobCd(reserveJob.getJobCd())
                    .orElseThrow(() -> new NoDataException("스케줄 정보가 존재하지 않습니다."));

            GenContentHistory history = modelMapper.map(reserveJob, GenContentHistory.class);

            history.setJobSeq(genContent.getJobSeq());
            history.setGenContent(genContent);
            history = jobContentService.insertGenContentHistory(history);


            success = handler.addReserveJob(history);
            log.debug("예약작업 Job 추가 테스트");

            //실행 결과가 실패인 경우
            if(!success){
                throw new MokaException("등록작업이 실패했습니다.");
            }

            ResultDTO<Boolean> resultDto = new ResultDTO<>(success);
            return new ResponseEntity<>(resultDto, HttpStatus.OK);
        } catch (Exception ex) {
            ResultDTO<Boolean> resultDto = new ResultDTO<>(400, ex.toString());
            return new ResponseEntity<>(resultDto, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 예약 Job 실행 취소
     *
     * @param jobTaskSeq Task 일련번호
     * @return 추가 결과
     * @throws MokaException 일반적인 오류 처리
     */
    @ApiOperation(value = "Job 제거")
    @DeleteMapping("/{jobTaskSeq}")
    public ResponseEntity<?> deleteJob(@ApiParam("Task 일련번호") @PathVariable("jobTaskSeq") @Min(value = 0) Long jobTaskSeq)
            throws MokaException {

        try {
            boolean success = handler.removeReserveJob(jobTaskSeq);
            log.debug("예약작업 Job 실행취소 테스트");

            //실행 결과가 실패인 경우
            if(!success){
                throw new MokaException("취소작업이 실패했습니다.");
            }

            ResultDTO<Boolean> resultDto = new ResultDTO<>(success, "success");
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception ex) {
            ResultDTO<Boolean> resultDto = new ResultDTO<>(400, ex.toString());
            return new ResponseEntity<>(resultDto, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
