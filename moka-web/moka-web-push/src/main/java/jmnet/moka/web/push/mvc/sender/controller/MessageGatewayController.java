package jmnet.moka.web.push.mvc.sender.controller;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.web.push.mvc.sender.dto.PushSendDTO;
import jmnet.moka.web.push.mvc.sender.entity.MobPushItem;
import jmnet.moka.web.push.support.sender.PushSenderHandler;
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
 * Package : jmnet.moka.web.push.mvc.sender.controller
 * ClassName : MessageGatewayController
 * Created : 2021-02-05 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-05 17:40
 */
@RestController
@RequestMapping("/api/push")
@Slf4j
public class MessageGatewayController {

    @Autowired
    private PushSenderHandler pushSenderHandler;


    /**
     * 신규 Job 추가
     *
     * @param sendDTO 전송 요청 정보
     * @return 추가 결과
     * @throws MokaException 일반적인 오류 처리
     */
    @ApiOperation(value = "신규 Job 추가")
    @PostMapping
    public ResponseEntity<?> postJob(@Valid PushSendDTO sendDTO)
            throws MokaException {

        /**
         * todo 1. 파라미터 Validation
         * - 푸시 유형별 파라미터 Valid 정보가 다양할 것으로 판단 됨
         */

        /**
         *  todo 2. TB_PUSH_CONTENTS에 푸시 정보 등록
         */

        /**
         * todo 3. TB_PUSH_CONTENTS_PROC에 앱별 푸시 상태 정보 등록
         * - status_flag = '0'
         * */

        /**
         * pushSenderHandler에 푸시 처리 요청
         */
        MobPushItem pushItem = MobPushItem
                .builder()
                .pushType(sendDTO.getPushType())
                .pushItemSeq((long) Math.random())
                .build();
        boolean success = pushSenderHandler.addPushJob(pushItem);

        log.debug("푸시 전송 Job 추가");

        ResultDTO<Boolean> resultDto = new ResultDTO<>(success, "success");

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }

    /**
     * 예약 발송 취소
     *
     * @param jobTaskSeq Task 일련번호
     * @return 추가 결과
     * @throws MokaException 일반적인 오류 처리
     */
    @ApiOperation(value = "예약 취소")
    @DeleteMapping
    public ResponseEntity<?> deleteJob(@ApiParam("Task 일련번호") @PathVariable("jobTaskSeq") @Min(value = 0) Long jobTaskSeq)
            throws MokaException {

        /**
         * todo 4. 요청한 취소 정보가 취소 가능한 작업인지 확인
         */

        // 취소 처리
        boolean success = pushSenderHandler.removeReservePushJob(jobTaskSeq);

        log.debug("예약 발송 취소 테스트");

        ResultDTO<Boolean> resultDto = new ResultDTO<>(success, "success");

        return new ResponseEntity<>(resultDto, HttpStatus.OK);
    }
}
