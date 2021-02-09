package jmnet.moka.web.schedule.mvc.schedule.controller;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import javax.validation.constraints.Min;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;
import jmnet.moka.web.schedule.support.schedule.ScheduleJobHandler;
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
 * 스케줄 관리 Controller
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.schedule.controller
 * ClassName : ScheduleJobController
 * Created : 2021-02-05 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-05 17:40
 */
@RestController
@RequestMapping("/api/schedule")
@Slf4j
public class ScheduleJobController {

    @Autowired
    private ScheduleJobHandler handler;


    /**
     * 신규 Job 추가
     *
     * @param jobSeq job 일련번호
     * @return 추가 결과
     */
    @ApiOperation(value = "신규 Job 추가")
    @PostMapping("/{jobSeq}")
    public ResponseEntity<?> postJob(@ApiParam("job 일련번호") @PathVariable("jobSeq") @Min(value = 0) Long jobSeq) {

        boolean success = handler.appendJob(GenContent
                .builder()
                .jobSeq(1l)
                .jobType("SCHEDULE")
                .programeNm("jmnet.moka.web.schedule.mvc.schedule.service.DummyScheduleJob")
                .period(1l)
                .build());

        log.debug("실행 테스트 : {}", success);

        ResultDTO<Boolean> resultDto = new ResultDTO<>(success, "success");

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 신규 Job 추가
     *
     * @param jobSeq job 일련번호
     * @return 추가 결과
     */
    @ApiOperation(value = "Job 제거")
    @DeleteMapping("/{jobSeq}")
    public ResponseEntity<?> deleteJob(@ApiParam("job 일련번호") @PathVariable("jobSeq") @Min(value = 0) Long jobSeq) {

        boolean success = handler.removeJob(1L);

        log.debug("스케줄 Job 제거 테스트 : {}", success);

        ResultDTO<Boolean> resultDto = new ResultDTO<>(success, "success");

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
}
