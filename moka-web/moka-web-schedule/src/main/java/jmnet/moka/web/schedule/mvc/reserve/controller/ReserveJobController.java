package jmnet.moka.web.schedule.mvc.reserve.controller;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;
import jmnet.moka.web.schedule.mvc.reserve.dto.ReserveJobDTO;
import jmnet.moka.web.schedule.support.reserve.ReserveJobHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
public class ReserveJobController {

    @Autowired
    private ReserveJobHandler handler;


    /**
     * 신규 Job 추가
     *
     * @param reserveJob job 일련번호
     * @return 추가 결과
     * @throws MokaException 일반적인 오류 처리
     */
    @ApiOperation(value = "신규 Job 추가")
    @PostMapping
    public ResponseEntity<?> postJob(@Valid ReserveJobDTO reserveJob)
            throws MokaException {

        handler.addReserveJob(reserveJob, GenContent
                .builder()
                .jobSeq(reserveJob.getJobSeq())
                .jobType("RESERVE")
                .programeNm("jmnet.moka.web.schedule.mvc.reserve.service.SnsShareReserveJob")
                .period(1l)
                .build());

        log.debug("예약작업 Job 추가 테스트");

        ResultDTO<Boolean> resultDto = new ResultDTO<>(true, "success");

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 신규 Job 추가
     *
     * @param jobTaskSeq Task 일련번호
     * @return 추가 결과
     * @throws MokaException 일반적인 오류 처리
     */
    @ApiOperation(value = "Job 제거")
    @DeleteMapping("/{jobTaskSeq}")
    public ResponseEntity<?> deleteJob(@ApiParam("Task 일련번호") @PathVariable("jobTaskSeq") @Min(value = 0) Long jobTaskSeq)
            throws MokaException {

        handler.removeReserveJob(jobTaskSeq);

        log.debug("예약작업 Job 제거 테스트");

        ResultDTO<Boolean> resultDto = new ResultDTO<>(true, "success");

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
}
