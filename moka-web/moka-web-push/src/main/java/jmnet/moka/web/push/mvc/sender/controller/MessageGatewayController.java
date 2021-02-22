package jmnet.moka.web.push.mvc.sender.controller;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import javax.validation.Valid;
import javax.validation.constraints.Min;

import jmnet.moka.web.push.mvc.sender.dto.*;
import jmnet.moka.web.push.mvc.sender.entity.PushContents;
import jmnet.moka.web.push.mvc.sender.entity.PushContentsProc;
import jmnet.moka.web.push.mvc.sender.service.PushAppDeleteService;
import jmnet.moka.web.push.mvc.sender.service.PushContentsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import org.modelmapper.ModelMapper;

import jmnet.moka.common.utils.McpString;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.dto.ResultDTO;

import jmnet.moka.core.common.exception.InvalidDataException;
import jmnet.moka.core.common.dto.InvalidDataDTO;
import jmnet.moka.core.common.exception.MokaException;

import jmnet.moka.web.push.support.sender.PushSenderHandler;

import jmnet.moka.web.push.mvc.sender.service.PushAppService;
import jmnet.moka.web.push.mvc.sender.entity.MobPushItem;


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

    @Autowired
    protected ModelMapper modelMapper;

    private final PushAppService pushAppService;

    private final PushContentsService pushContentsService;

    private final PushAppDeleteService pushAppDeleteService;

    public MessageGatewayController(PushAppService pushAppService, PushContentsService pushContentsService, PushAppDeleteService pushAppDeleteService) {
        this.pushAppService = pushAppService;
        this.pushContentsService = pushContentsService;
        this.pushAppDeleteService = pushAppDeleteService;
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

        /**
         * todo 1. 파라미터 Validation
         * - 푸시 유형별 파라미터 Valid 정보가 다양할 것으로 판단 됨
         */
        //validCodeData(sendDTO);

        //앱 일련번호
        Long appSeq = sendDTO.getJobSeq();
        //푸시기사 일련번호
        Long relContentId = sendDTO.getRelContentId();

        //앱 정보
        PushAppSearchDTO checkItem = new PushAppSearchDTO();
        checkItem.setAppOs(sendDTO.getPushApps().get(0).getAppOs());
        checkItem.setDevDiv(sendDTO.getPushApps().get(0).getDevDiv());
        checkItem.setAppDiv(sendDTO.getPushApps().get(0).getAppDiv());
        checkItem.setAppSeq(appSeq);

        //등록불가 작업인지 확인(기존데이터와 JobSeq 가 동일하면 등록불가)
        //if (pushAppService.isValidData(checkItem)) {
        //    throw new InvalidDataException("동일한 앱 일련번호가 있습니다.");
        //}

        /**
         *  todo 2. TB_PUSH_CONTENTS에 푸시 정보 등록
         */
        checkItem.setRelContentId(relContentId);

        //등록불가 작업인지 확인(기존데이터와 contentSeq 가 동일하면 등록불가)
        if (pushContentsService.isValidData(checkItem)) {
            throw new InvalidDataException("동일한 컨텐츠 일련번호가 있습니다.");
        }

        PushContentsDTO contentsItem = new PushContentsDTO();

        //받아온 값 셋팅
        contentsItem.setRelContentId(relContentId);
        contentsItem.setPushType(sendDTO.getPushType());
        contentsItem.setIconType(sendDTO.getIconType());
        contentsItem.setRsvDt(McpDate.date("yyyyMMdd", sendDTO.getReserveDt().toString()));

        contentsItem.setTitle(sendDTO.getTitle());
        contentsItem.setSubTitle(sendDTO.getTitle());
        contentsItem.setContent(sendDTO.getContent());

        //Default 값 셋팅
        contentsItem.setUsedYn("Y");
        contentsItem.setPushYn("N");
        contentsItem.setSendEmail("N");

        contentsItem.setRegId("ssc01");
        contentsItem.setModId("ssc01");
        contentsItem.setRegDt(McpDate.todayDate());
        contentsItem.setModDt(McpDate.todayDate());

        try {
            PushContents pushContents = modelMapper.map(contentsItem, PushContents.class);
            PushContents returnValue = pushContentsService.savePushContents(pushContents);
            log.debug("[SUCCESS TO INSERT PUSH CONTENTS]");
        } catch (Exception e) {
            log.error("[FAIL TO INSERT PUSH CONTENTS]", e);
            throw new Exception("푸시 기사가 등록 되지 않습니다.", e);
        }

        /**
         * todo 3. TB_PUSH_CONTENTS_PROC에 앱별 푸시 상태 정보 등록
         * - status_flag = '0'
         * */

        PushRelContentIdSearchDTO searchRelContentId = new PushRelContentIdSearchDTO();

        //푸시기사 일련번호로 등롣된 푸시기사 정보 조회
        searchRelContentId.setRelContentId(relContentId);

        Page<PushContents> returnValue = pushContentsService.findPushContentsList(searchRelContentId);

        List<PushContentsDTO> dtoList = modelMapper.map(returnValue.getContent(), PushContentsDTO.TYPE);

        Long contentSeq = dtoList.get(0).getContentSeq().longValue();
        Integer cnt = 0;

        if(dtoList.size() > 0){
            PushContentsProcDTO contentsProcItem = new PushContentsProcDTO();

            //조회 값 셋팅
            contentsProcItem.setContentSeq(contentSeq);
            contentsProcItem.setAppSeq(appSeq);
            contentsProcItem.setStatusFlag("0");
            contentsProcItem.setTargetCnt(cnt.longValue());
            contentsProcItem.setSendCnt(cnt.longValue());
            contentsProcItem.setRcvCnt(cnt.longValue());
            contentsProcItem.setOpenCnt(cnt.longValue());
            contentsProcItem.setLastTokenSeq(cnt.longValue());

            try {
                PushContentsProc pushContentsProc = modelMapper.map(contentsProcItem, PushContentsProc.class);
                PushContentsProc returnProcValue = pushContentsService.savePushContentsProc(pushContentsProc);
                log.debug("[SUCCESS TO INSERT PUSH CONTENTSPROC]");
            } catch (Exception e) {
                log.error("[FAIL TO INSERT PUSH CONTENTSPROC]", e);
                throw new Exception("푸시 기사 이력 등록이 되지 않습니다.", e);
            }
        }

        //예약 발송 취소 처리
        deleteJob(contentSeq);

        /**
         * pushSenderHandler에 푸시 처리 요청
         */
        MobPushItem pushItem = MobPushItem
                .builder()
                .pushType(sendDTO.getPushType())
                .pushItemSeq(contentSeq)
               // .pushItemSeq((long) Math.random())
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
            throws Exception {

        /**
         * todo 4. 요청한 취소 정보가 취소 가능한 작업인지 확인
         */
        String pushYn = "N";
        Long deleteYn = pushAppDeleteService.countByContentSeqAndPushYn(jobTaskSeq, pushYn);

        if(deleteYn == 0){
            throw new InvalidDataException("예약 발송 취소할 작업이 없습니다.");
        }
        PushContentSeqSearchDTO searchContentSeq = new PushContentSeqSearchDTO();

        //푸시기사 일련번호로 등롣된 푸시기사 정보 조회
        searchContentSeq.setContentSeq(jobTaskSeq);

        try{
            Page<PushContents> returnValue = pushContentsService.findPushContents(searchContentSeq);

            List<PushContentsDTO> dtoList = modelMapper.map(returnValue.getContent(), PushContentsDTO.TYPE);

            PushContentsDTO contentsItem = new PushContentsDTO();

            // 예약 취소 상태 처리 값 셋팅
            contentsItem.setUsedYn("N");

            // 취소 처리할 푸시기사 기존 정보 셋팅
            contentsItem.setContentSeq(dtoList.get(0).getContentSeq().longValue());
            contentsItem.setPushYn(dtoList.get(0).getPushYn());
            contentsItem.setPushType(dtoList.get(0).getPushType());
            contentsItem.setIconType(dtoList.get(0).getIconType());
            contentsItem.setPicYn(dtoList.get(0).getPicYn());
            contentsItem.setSendEmail(dtoList.get(0).getSendEmail());
            contentsItem.setRsvDt(dtoList.get(0).getRsvDt());
            contentsItem.setRegId(dtoList.get(0).getRegId());
            contentsItem.setRegDt(dtoList.get(0).getRegDt());
            contentsItem.setModDt(dtoList.get(0).getModDt());
            contentsItem.setModId(dtoList.get(0).getModId());
            contentsItem.setRelContentId(dtoList.get(0).getRelContentId());
            contentsItem.setRelUrl(dtoList.get(0).getRelUrl());
            contentsItem.setImgUrl(dtoList.get(0).getImgUrl());
            contentsItem.setPushImgUrl(dtoList.get(0).getPushImgUrl());
            contentsItem.setTitle(dtoList.get(0).getTitle());
            contentsItem.setSubTitle(dtoList.get(0).getSubTitle());
            contentsItem.setContent(dtoList.get(0).getContent());

            PushContents pushContents = modelMapper.map(contentsItem, PushContents.class);

            boolean success = pushSenderHandler.removeReservePushJob(pushContents);

            log.debug("예약 발송 취소");

            ResultDTO<Boolean> resultDto = new ResultDTO<>(success, "success");

            return new ResponseEntity<>(resultDto, HttpStatus.OK);

        } catch (Exception e) {
            log.error("[FAIL TO 예약 발송 취소 ]", e);
            throw new Exception(String.valueOf(e));

        }
    }

    private void validCodeData(PushSendDTO sendDTO) throws InvalidDataException {

        List<InvalidDataDTO> invalidList = new ArrayList<InvalidDataDTO>();

        if (sendDTO != null) {
            try{
                String AppOs = sendDTO.getPushApps().get(0).getAppOs();
                String DevDiv = sendDTO.getPushApps().get(0).getDevDiv();
                String AppDiv = sendDTO.getPushApps().get(0).getAppDiv();

                //Device OS
                if (McpString.isEmpty(AppOs)) {
                    String message = "디바이스 OS (iOS,WIN,MAC) is null";
                    throw new InvalidDataException(message);
                }
                if(AppOs.contains("iOS")||AppOs.contains("WIN")||AppOs.contains("MAC")){
                }else{
                    String message = "디바이스 Os does not fit";
                    throw new InvalidDataException(message+":"+AppOs);
                }

                //디바이스 구분(T:Tablet, M:Mobile, PC : P)
                if (McpString.isEmpty(DevDiv)) {
                    String message = "디바이스 구분 (T,M,P) is null";
                    throw new InvalidDataException(message);
                }
                if(DevDiv.contains("T")||DevDiv.contains("M")||DevDiv.contains("P")){
                }else{
                    String message = "DevDiv does not fit";
                    throw new InvalidDataException(message+":"+DevDiv);
                }

                //앱 구분(J:중앙일보, M:미세먼지, PWA : P)
                if (McpString.isEmpty(AppDiv)) {
                    String message = "앱 구분(J,M,P) is null";
                    throw new InvalidDataException(message);
                }
                if(AppDiv.contains("J")||AppDiv.contains("M")||AppDiv.contains("P")){
                }else{
                    String message = "AppDiv does not fit";
                    throw new InvalidDataException(message+":"+AppDiv);
                }

                //푸시종류(속보:T, 추천기사:S, 미리보는오늘:R, 뉴스룸레터:N) 체크
                String pushType = sendDTO
                        .getPushType();
                if (McpString.isEmpty(pushType)) {
                    String message = "푸시종류(T,S,R,N) is null";
                    throw new InvalidDataException(message);
                }
                if(pushType.contains("T")||pushType.contains("S")||pushType.contains("R")||pushType.contains("N")){
                }else{
                    String message = "pushType does not fit";
                    throw new InvalidDataException(message+":"+pushType);
                }
                //요청일자 체크
                String reserveDt = sendDTO
                        .getReserveDt().toString();
                if (McpString.isEmpty(reserveDt)) {
                    String message = "Please check the date";
                    throw new InvalidDataException(message);
                }
            } catch (IndexOutOfBoundsException e) {
                log.error("[FAIL TO PUSH JOB pushApps[0] is Null ]", e);
                throw new IndexOutOfBoundsException(String.valueOf(e));

            }
        }

    }
}
