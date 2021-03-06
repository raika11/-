package jmnet.moka.web.schedule.mvc.system.controller;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.web.schedule.mvc.gen.entity.GenContent;
import jmnet.moka.web.schedule.mvc.gen.service.GenContentService;
import jmnet.moka.web.schedule.support.system.InstantJobHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.constraints.Min;

/**
 * <pre>
 * 시스템 Controller
 * Project : moka
 * Package : jmnet.moka.web.schedule.mvc.schedule.SystemController
 * ClassName : ReserveJobController
 * Created : 2021-02-05 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-05 17:40
 */
@RestController
@RequestMapping("/api/system")
@Slf4j
public class SystemController {

    @Autowired
    private GenContentService jobContentService;

    @Autowired
    private InstantJobHandler instantJobHandler;


    /**
     * 실패 작업 재실행
     *
     * @param jobSeq job 일련번호
     * @return 실행 결과
     */
    @ApiOperation(value = "실패 작업 재실행")
    @PostMapping("/instant/{jobSeq}")
    public ResponseEntity<?> postJob(@ApiParam("job 일련번호") @PathVariable("jobSeq") @Min(value = 0) Long jobSeq) {
        boolean success = false;
        try {

            GenContent genContent = jobContentService
                    .findJobContentBySeq(jobSeq)
                    .orElseThrow();

            //성공한 작업은 재실행 불가
            if(genContent.getGenStatus().getGenResult() == 200L){
                throw new MokaException("실패한 작업만 재실행이 가능합니다.");
            }

            success = instantJobHandler.runInstantJob(genContent);
            log.debug("{} 재실행 결과 : {}", jobSeq, success);

            //재실행 결과가 실패인 경우
            if(!success){
                throw new MokaException("재실행이 실패했습니다.");
            }

            ResultDTO<Boolean> resultDto = new ResultDTO<>(success, "success");
            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception ex) {
            ResultDTO<Boolean> resultDto = new ResultDTO<>(400, ex.toString());
            return new ResponseEntity<>(resultDto, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}