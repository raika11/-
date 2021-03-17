package jmnet.moka.web.push.mvc.sender.controller;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.exception.MokaException;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.web.push.common.AbstractCommonController;
import jmnet.moka.web.push.mvc.sender.dto.*;
import jmnet.moka.web.push.mvc.sender.entity.PushApp;
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
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import java.util.List;


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

    public MessageGatewayController(PushAppService pushAppService, PushContentsService pushContentsService, PushContentsProcService pushContentsProcService) {
        this.pushAppService = pushAppService;
        this.pushContentsService = pushContentsService;
        this.pushContentsProcService = pushContentsProcService;
    }

    public static String UsedYn = MokaConstants.YES;        //노출유무
    public static String PushYn = MokaConstants.NO;         //푸시상태
    public static String SendEmailYn = MokaConstants.NO;    //메일 발송 여부 ( Y:발송, N:발송안함 )
    public static String PicYn = MokaConstants.NO;          //레터에서 편집자 사진 노출여부(Y/N)
    public static String RegId = "ssc01";                   //등록자
    public static String StatusFlag = "0";                  //전송 상태

    public static Integer AppSeq;
    public static String AppOs;
    public static String AppDiv;
    public static String DevDiv;
    public static Long relContentId;

    public static Long contentSeq;

    public static int chkAppSeq;
    public static Long cnt;
    public static Long deleteYn = 0L;

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

        AppOs  = sendDTO.getPushApps().get(0).getAppOs();
        AppDiv = sendDTO.getPushApps().get(0).getDevDiv();
        DevDiv = sendDTO.getPushApps().get(0).getAppDiv();

        //푸시기사 일련번호(관련 콘텐트ID)
        relContentId = sendDTO.getRelContentId();

        //앱 정보
        PushAppSearchDTO checkItem = new PushAppSearchDTO();
        checkItem.setAppOs(AppOs);
        checkItem.setDevDiv(DevDiv);
        checkItem.setAppDiv(AppDiv);

        if(sendDTO.getJobSeq() == null){
            log.debug("{} chkAppSeq AppOs: {} AppDiv: {} DevDiv: {}", AppOs, AppDiv, DevDiv);

            PushApp pushApp = pushAppService
                    .findById(AppOs, AppDiv, DevDiv)
                    .orElseThrow(() -> {
                        return new NoDataException(msg("wpush.error.notnull.appPushInfo"));
                    });

            chkAppSeq = pushApp.getAppSeq();
            AppSeq = chkAppSeq;
        }else{
            AppSeq = sendDTO.getJobSeq().intValue();
        }

        checkItem.setAppSeq(AppSeq);

        /**
         *  TB_PUSH_CONTENTS에 푸시 정보 등록
         */
        checkItem.setRelContentId(relContentId);

        //등록불가 작업인지 확인(기존데이터와 contentSeq 가 동일하면 등록불가)
        if (pushContentsService.isValidData(checkItem)) {
            String message = msg("common.error.dup.content");
            throw new InvalidDataException(message);
        }

        try {
            pushContentsService.savePushContents(PushContents
                    .builder()
                    .relContentId(relContentId)
                    .pushType(sendDTO.getPushType())
                    .iconType(sendDTO.getIconType())
                    .rsvDt(sendDTO.getReserveDt())
                    .picYn(sendDTO.getPicYn())
                    .sendEmail(sendDTO.getSendEmail())
                    .repId(sendDTO.getRepId())
                    .relUrl(sendDTO.getRelUrl())
                    .imgUrl(sendDTO.getImgUrl())
                    .pushImgUrl(sendDTO.getPushUrl())
                    .title(sendDTO.getTitle())
                    .subTitle(sendDTO.getTitle())
                    .content(sendDTO.getContent())
                    .usedYn(UsedYn)
                    .pushYn(PushYn)
                    .sendEmail(SendEmailYn)
                    .picYn(PicYn)
                    .regId(RegId)
                    .modId(RegId)
                    .regDt(McpDate.now())
                    .modDt(McpDate.now())
                    .build());
        } catch (Exception e) {
            String message = msg("wpush.contents.error.insert");
            throw new Exception(message, e);
        }

        /**
         * TB_PUSH_CONTENTS_PROC에 앱별 푸시 상태 정보 등록
         * - status_flag = '0'
         * */
        try {

            PushContents pushContents = pushContentsService
                    .findByRelContentId(relContentId)
                    .orElseThrow(() -> {
                        return new NoDataException(msg("wpush.contentsProc.error.notnull"));
                    });
            contentSeq = pushContents.getContentSeq();
            cnt = 0L;

            PushContentsProcPK pushContentsProcPK = PushContentsProcPK
                    .builder()
                    .contentSeq(contentSeq)
                    .appSeq(AppSeq.intValue())
                    .build();

            pushContentsProcService.savePushContentsProc(PushContentsProc
                    .builder()
                    .id(pushContentsProcPK)
                    .statusFlag(StatusFlag)
                    .targetCnt(cnt)
                    .sendCnt(cnt)
                    .rcvCnt(cnt)
                    .openCnt(cnt)
                    .lastTokenSeq(cnt)
                    .build());
        } catch (Exception e) {
            String message = msg("wpush.contentsProc.error.insert");
            throw new Exception(message, e);
        }

        /** Push request to pushSenderHandler */
        PushContents pushItem = PushContents
                .builder()
                .pushType(sendDTO.getPushType())
                .contentSeq(contentSeq)
                .rsvDt(sendDTO.getReserveDt())
                .build();
        boolean success = pushSenderHandler.addPushJob(pushItem,AppSeq);

        ResultDTO<Boolean> resultDto = new ResultDTO<>(success, "success");

        //ResultDTO<Boolean> resultDto = new ResultDTO<>();
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
                                       @ApiParam("Task 일련번호") @PathVariable("jobTaskSeq")
                                       @Min(value = 0, message = "wpush.common.error.min.seq") Long jobTaskSeq)
            throws Exception {
        /**
         * 요청한 취소 정보가 취소 가능한 작업인지 확인
         */
        //Long deleteYn = pushContentsService.countByContentSeqAndPushYn(jobTaskSeq, PushYn);

        if(deleteYn == 0){
            String message = msg("wpush.error.send.cancel.no-data");
            throw new InvalidDataException(message);
        }else{
            try{
                PushContents pushContents = pushContentsService
                        .findPushContentsBySeq(jobTaskSeq)
                        .orElseThrow(() -> {
                            return new NoDataException(msg("wpush.contents.error.notnull"));
                        });
                // 예약 취소 상태 처리 값 셋팅
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
