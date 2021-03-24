package jmnet.moka.web.push.mvc.sender.controller;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.web.push.common.AbstractCommonController;
import jmnet.moka.web.push.mvc.sender.dto.PushAppSearchDTO;
import jmnet.moka.web.push.mvc.sender.dto.PushSendDTO;
import jmnet.moka.web.push.mvc.sender.entity.PushContents;
import jmnet.moka.web.push.mvc.sender.entity.PushContentsProc;
import jmnet.moka.web.push.mvc.sender.entity.PushContentsProcPK;
import jmnet.moka.web.push.mvc.sender.service.PushAppService;
import jmnet.moka.web.push.mvc.sender.service.PushContentsProcService;
import jmnet.moka.web.push.mvc.sender.service.PushContentsService;
import jmnet.moka.web.push.support.sender.PushSenderHandler;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
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
public class MessageGatewayController extends AbstractCommonController {

    @Autowired
    private PushSenderHandler pushSenderHandler;

    @Autowired
    protected ModelMapper modelMapper;

    private final PushAppService pushAppService;

    private final PushContentsService pushContentsService;
    private final PushContentsProcService pushContentsProcService;

    public MessageGatewayController(PushAppService pushAppService, PushContentsService pushContentsService,
            PushContentsProcService pushContentsProcService) {
        this.pushAppService = pushAppService;
        this.pushContentsService = pushContentsService;
        this.pushContentsProcService = pushContentsProcService;
    }

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
            throws Exception {
        for (Integer appSeq : sendDTO.getAppSeq()) {

            /** Check if there is AppSeq    */
            PushAppSearchDTO checkItem = new PushAppSearchDTO();
            checkItem.setAppSeq(appSeq);

            if (!pushAppService.isValidData(checkItem)) {
                String message = msg("wpush.error.notnull.appPushInfo");
                throw new InvalidDataException(message);
            }
        }
        PushContents pushContents = modelMapper.map(sendDTO, PushContents.class);

        /** Insert to TB_PUSH_CONTENTS the PushContent Info */
        try {
            pushContentsService.savePushContents(pushContents);
        } catch (Exception e) {
            String message = msg("wpush.contents.error.insert");
            throw new Exception(message, e);
        }

        for (Integer appSeq : sendDTO.getAppSeq()) {
            /** Insert to TB_PUSH_CONTENTS_PROC the PushContentProc Info    */
            try {
                List<PushContents> pushContentList = pushContentsService.findByRelContentId(sendDTO.getRelContentId());

                PushContentsProcPK pushContentsProcPK = PushContentsProcPK
                        .builder()
                        .contentSeq(pushContentList
                                .get(0)
                                .getContentSeq())
                        .appSeq(appSeq)
                        .build();

                PushContentsProc pushContentsProc = new PushContentsProc();
                pushContentsProc.setId(pushContentsProcPK);
                pushContentsProcService.savePushContentsProc(pushContentsProc);

            } catch (Exception e) {
                String message = msg("wpush.contentsProc.error.insert");
                throw new Exception(message, e);
            }
        }

        /** Push request to pushSenderHandler */
        boolean success = pushSenderHandler.addPushJob(pushContents);
        ResultDTO<Boolean> resultDto = resultDto = new ResultDTO<>(success, "success");
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
    @DeleteMapping("/{jobTaskSeq}")
    public ResponseEntity<?> deleteJob(HttpServletRequest request,
            @ApiParam("Task 일련번호") @PathVariable("jobTaskSeq") @Min(value = 0, message = "wpush.common.error.min.seq") Long jobTaskSeq)
            throws Exception {

        /** Check if the requested cancellation information is a cancelable operation */
        Long deleteYn = pushContentsService.countByContentSeqAndPushYn(jobTaskSeq, MokaConstants.NO);

        if (deleteYn == 0) {
            String message = msg("wpush.error.send.cancel.no-data");
            throw new InvalidDataException(message);
        } else {
            try {
                PushContents pushContents = pushContentsService
                        .findPushContentsBySeq(jobTaskSeq)
                        .orElseThrow(() -> {
                            return new NoDataException(msg("wpush.contents.error.notnull"));
                        });

                pushContents.setUsedYn(MokaConstants.NO);

                boolean success = pushSenderHandler.removeReservePushJob(pushContents);
                ResultDTO<Boolean> resultDto = new ResultDTO<>(success, "success");
                return new ResponseEntity<>(resultDto, HttpStatus.OK);

            } catch (Exception e) {
                String message = msg("wpush.error.send.cancel");
                throw new Exception(message);
            }
        }
    }
}
