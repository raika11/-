package jmnet.moka.web.schedule.mvc.schedule.controller;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import javax.validation.constraints.Min;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.core.common.exception.MokaException;
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
        try {
            boolean success = handler.appendJob(jobSeq);
            log.debug("실행 테스트 : {}", success);

            //등록 결과가 실패인 경우
            if(!success){
                throw new MokaException("작업등록이 실패했습니다.");
            }

            ResultDTO<Boolean> resultDto = new ResultDTO<>(success, "success");
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception ex) {
            ResultDTO<Boolean> resultDto = new ResultDTO<>(400, ex.toString());
            return new ResponseEntity<>(resultDto, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 등록된 Job 제거
     *
     * @param jobSeq job 일련번호
     * @return 제거 결과
     */
    @ApiOperation(value = "Job 제거")
    @DeleteMapping("/{jobSeq}")
    public ResponseEntity<?> deleteJob(@ApiParam("job 일련번호") @PathVariable("jobSeq") @Min(value = 0) Long jobSeq) {
        try {
            boolean success = handler.removeJob(jobSeq);

            log.debug("스케줄 Job 제거 테스트 : {}", success);

            //삭제 결과가 실패인 경우
            if(!success){
                throw new MokaException("작업삭제가 실패했습니다.");
            }

            ResultDTO<Boolean> resultDto = new ResultDTO<>(success, "success");
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception ex) {
            ResultDTO<Boolean> resultDto = new ResultDTO<>(400, ex.toString());
            return new ResponseEntity<>(resultDto, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
