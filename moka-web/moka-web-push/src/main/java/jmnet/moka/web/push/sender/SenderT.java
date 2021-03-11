package jmnet.moka.web.push.sender;

import jmnet.moka.common.utils.McpDate;
import jmnet.moka.web.push.mvc.sender.dto.*;
import jmnet.moka.web.push.mvc.sender.entity.*;
import jmnet.moka.web.push.mvc.sender.service.*;
import jmnet.moka.web.push.support.code.FcmErrorType;
import jmnet.moka.web.push.support.code.StatusFlagType;
import jmnet.moka.web.push.support.httpclient.PushHttpClientBuilder;
import jmnet.moka.web.push.support.message.*;
import jmnet.moka.web.push.support.sender.AbstractPushSender;
import lombok.extern.slf4j.Slf4j;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * <pre>
 * 푸시 전송 속보 Sender
 * Project : moka
 * Package : jmnet.moka.web.push.sender
 * ClassName : SenderT
 * Created : 2021-02-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-08 15:33
 */
@Slf4j
@Service
public class SenderT extends AbstractPushSender {

    private final PushAppService pushAppService;

    private final PushContentsService pushContentsService;

    private final PushContentsProcService pushContentsProcService;
    private final PushAppTokenService pushAppTokenService;

    private final PushAppTokenHistService pushAppTokenHistService;
    private final PushTokenSendHistService pushTokenSendHistService;

    @Autowired
    protected ModelMapper modelMapper;

    public SenderT(PushAppService pushAppService, PushContentsService pushContentsService, PushContentsProcService pushContentsProcService, PushAppTokenService pushAppTokenService, PushAppTokenHistService pushAppTokenHistService, PushTokenSendHistService pushTokenSendHistService) {
        this.pushAppService = pushAppService;
        this.pushContentsService = pushContentsService;
        this.pushContentsProcService = pushContentsProcService;
        this.pushAppTokenService = pushAppTokenService;
        this.pushAppTokenHistService = pushAppTokenHistService;
        this.pushTokenSendHistService = pushTokenSendHistService;
    }

    @Override
    public FcmMessage makePushMessage(Long pushItemSeq, int appSeq) {
        long contentSeq = pushItemSeq;
        log.debug("[FcmMessage makePushMessage] pushItemSeq=", pushItemSeq);

        PushContentSeqSearchDTO searchContentSeq = new PushContentSeqSearchDTO();

        searchContentSeq.setContentSeq(pushItemSeq);

        Page<PushContents> returnValue1 = pushContentsService.findAllByContentSeq(searchContentSeq);

        List<PushContentsDTO> dtoList1 = modelMapper.map(returnValue1.getContent(), PushContentsDTO.TYPE);

        String pushType = dtoList1.get(0).getPushType();
        String title = dtoList1.get(0).getTitle();
        String content = dtoList1.get(0).getContent();
        String pushImgUrl = dtoList1.get(0).getPushImgUrl();

        Optional<PushApp> pushApp = pushAppService.findByAppSeq(appSeq);

        Optional<PushAppToken> appToken = pushAppTokenService.findByAppSeq(appSeq);

        String token = appToken.get().getToken();

        System.out.println("token       =" + token);
        System.out.println("pushType    =" + pushType);
        System.out.println("contentSeq  =" + contentSeq);
        System.out.println("appSeq      =" + appSeq);
        System.out.println("title       =" + title);
        System.out.println("content     =" + content);

        /**
         * TODO 1. 업무별 푸시 메시지 생성 로직 구현
         */
        List<String> registration_ids = new ArrayList<String>();
        registration_ids.add(0,token);

        if(pushApp.equals("iOS")){
            Notification notification = new Notification();
            notification.setTitle(title);
            notification.setBody(content);
            notification.setContent_available("true");
            notification.setMutable_content("true");
            notification.setUrl("http://dn.joongdo.co.kr");
            notification.setKey3(153);
            notification.setImage_url(pushImgUrl);

            return FcmMessage.builder().notification(notification).registration_ids(registration_ids).build();
        }else{
            Map<String, String> data = new HashMap<>();
            data.put("key1",title);
            data.put("key2",content);
            data.put("key3","http://dn.joongdo.co.kr");
            data.put("img_name",pushImgUrl);

            return FcmMessage.builder().registration_ids(registration_ids).data(data).build();
        }
    }


    @Override
    protected Long findLastTokenSeq(Integer appSeq) {
        log.debug("속보 - 푸시 전송을 위한 작업 처리 :findLastTokenSeq  {}", appSeq);
        System.out.println("[SenderT findLastTokenSeq]  ================");
        /**
         * TODO 2. 대상 토큰 중 가장 큰 토큰 일련번호 조회
         * - 페이징 처리에 사용
         */

        Optional<PushAppToken> appToken = pushAppTokenService.findByAppSeq(appSeq);

        return appToken.get().getTokenSeq();
    }

    @Override
    protected List<PushAppToken> findAllToken(String pushType, long contentSeq, int appSeq, long lastTokenSeq, int pageIdx) throws Exception {

        log.debug("속보 - 푸시 전송을 위한 작업 처리 :findAllToken  {}", pageIdx);

        /**
         * TODO 3. 토큰 목록 조회
         */
        System.out.println("(int)lastTokenSeq   ="+(int)lastTokenSeq);
        System.out.println("appSeq              ="+appSeq);

        List<PushAppToken> returnValue = pushAppTokenService. findByTokenSeq(lastTokenSeq);
        //List<PushAppToken> returnValue = pushAppTokenService.findAllToken(appSeq, pageIdx);

        List<PushAppTokenDTO> pushAppTokenList = modelMapper.map(returnValue, PushAppTokenDTO.TYPE);

        System.out.println("**********************************************");
        System.out.println("getTokenSeq="+returnValue.get(0).getTokenSeq());
        System.out.println("getToken="+returnValue.get(0).getToken());



        PushAppTokenHistDTO pushAppTokenHistDTO = new PushAppTokenHistDTO();

        PushAppTokenHist pushAppTokenHist = modelMapper.map(pushAppTokenHistDTO, PushAppTokenHist.class);

        for (PushAppTokenDTO pushAppToken : pushAppTokenList) {

            log.debug("[ 푸시 앱 토큰 이력 등록 ]");
            try {
                    PushTokenSendHistDTO pushTokenSendHistDTO = new PushTokenSendHistDTO();

                    PushTokenSendHist pushTokenSendHist = modelMapper.map(pushTokenSendHistDTO, PushTokenSendHist.class);

                    pushTokenSendHist.setContentSeq(contentSeq);
                    pushTokenSendHist.setTokenSeq(pushAppToken.getTokenSeq());
                    pushTokenSendHist.setAppSeq(pushAppToken.getAppSeq().intValue());
                    pushTokenSendHist.setSendYn("N");
                    pushTokenSendHist.setRegDt(McpDate.now());

                    insertPushTokenSendHist(pushTokenSendHist);
                log.debug("[SUCCESS TO INSERT PUSH TOKEN SEND HIST]");
            } catch (Exception e) {
                log.error("[FAIL TO INSERT PUSH TOKEN SEND HIST]", e);
                throw new Exception("푸시 앱 토큰 전송 이력이 등록 되지 않습니다.", e);
            }

            log.debug("[ 푸시 토큰 전송 이력 등록 ]");
            try {
                    pushAppTokenHist.setTokenSeq(pushAppToken.getTokenSeq());
                    pushAppTokenHist.setAppSeq(pushAppToken.getAppSeq().intValue());
                    pushAppTokenHist.setBadge(pushAppToken.getBadge());
                    pushAppTokenHist.setMemId(pushAppToken.getMemId());
                    pushAppTokenHist.setToken(pushAppToken.getToken());
                    pushAppTokenHist.setInsDt(McpDate.now());
                    pushAppTokenHist.setRegDt(McpDate.now());
                    pushAppTokenHist.setToken(pushAppToken.getToken());

                    insertPushAppTokenHist(pushAppTokenHist);
                    //updatePushAppTokenHist(pushAppTokenHist);
                log.debug("[SUCCESS TO INSERT PUSH TOKEN HIST]");
            } catch (Exception e) {
                log.error("[FAIL TO INSERT PUSH TOKEN HIST]", e);
                throw new Exception("푸시 토큰 이력이 등록 되지 않습니다.", e);
            }
        }

        return returnValue;
    }


    @Override
    protected void insertPushTokenSendHist(PushTokenSendHist pushTokenSendHist) {
        log.debug(" [ 푸시 토큰 전송 이력 생성 로직 구현 ] :insertPushTokenSendHist");
        PushTokenSendHist returnValue = pushTokenSendHistService.savePushTokenSendHist(pushTokenSendHist);
    }
    @Override
    protected void insertPushAppTokenHist(PushAppTokenHist pushAppTokenHist) {
        log.debug(" [ 푸시 토큰 이력 생성 로직 구현 ] :insertPushAppTokenHist");
        PushAppTokenHist returnValue = pushAppTokenHistService.savePushAppTokenHist(pushAppTokenHist);
    }
    @Override
    protected void updatePushAppTokenHist(PushAppTokenHist pushAppTokenHist) {
        log.debug(" [ 푸시 토큰 이력 갱신 로직 구현 ] :updatePushAppTokenHist");
        PushAppTokenHist returnValue = pushAppTokenHistService.savePushAppTokenHist(pushAppTokenHist);
    }

    @Override
    protected void updateStatus(final long pushItemSeq, final Integer appSeq, final StatusFlagType status) {
        log.debug(" [ 앱별 전송 이력 갱신 로직 구현 ] :updateStatus");
        PushContentsProcPK pushContentsProcPK = PushContentsProcPK
                .builder()
                .contentSeq(pushItemSeq)
                .appSeq(appSeq)
                .build();

        Optional<PushContentsProc> pushContentsProc = pushContentsProcService.findPushContentsProcById(pushContentsProcPK);

        pushContentsProcService.savePushContentsProc(PushContentsProc
                .builder()
                .id(pushContentsProcPK)
                .statusFlag(status.getValue())
                .targetCnt(pushContentsProc.get().getTargetCnt())
                .sendCnt(pushContentsProc.get().getSendCnt())
                .rcvCnt(pushContentsProc.get().getRcvCnt())
                .openCnt(pushContentsProc.get().getOpenCnt())
                .lastTokenSeq(pushContentsProc.get().getLastTokenSeq())
                .startDt(pushContentsProc.get().getStartDt())
                .endDt(pushContentsProc.get().getEndDt())
                .build());
    }

    @Override
    protected void deleteTokens(List<PushAppToken> pushTokensMemberList) {

        //pushAppTokenHistService.savePushAppTokenHist(pushTokensMemberList);

    }

    @Override
    protected PushResponseMessage sendMessage(List<PushAppToken> pushTokens, FcmMessage pushMessage) throws Exception {

        PushResponseMessage sendMessage = new PushResponseMessage();
        
        try {
            System.out.println("[ SenderT PushResponseMessage sendMessage ]#####################################################");
            System.out.println("pushTokens.size    ="+pushTokens.size());
            System.out.println("pushTokens          ="+pushTokens.get(0).getToken());

            Optional<PushApp> pushAppOld = pushAppService.findByAppSeq(pushTokens.get(0).getAppSeq());

            System.out.println("getAppSeq    ="+pushAppOld.get().getAppSeq());
            System.out.println("getAppDiv    ="+pushAppOld.get().getAppDiv());
            System.out.println("getAppOs    ="+pushAppOld.get().getAppOs());
            System.out.println("getDevDiv    ="+pushAppOld.get().getDevDiv());

            PushApp pushApp = PushApp
                    .builder()
                    .appSeq(pushAppOld.get().getAppSeq())
                    .appDiv(pushAppOld.get().getAppDiv())
                    .appOs(pushAppOld.get().getAppOs())
                    .devDiv(pushAppOld.get().getDevDiv())
                    .appName(pushAppOld.get().getAppName())
                    .apiKey(pushAppOld.get().getApiKey())
                    .fcmKey(pushAppOld.get().getApiKey())
                    .build();

            /**
             * FCM에 푸시 요청
             */
            PushHttpResponse response = pushSend(pushTokens, pushApp, pushMessage);

            String multicastId = null;
            int statusCode = response.getStatusCode();
            int success = 0;
            int failure = 0;
            int canonicalIds =0;
            List<FcmResponseResultItem> results;

            System.out.println("-------------------------------------------------------------");
            System.out.println("PushToken    ="+response.getPushToken().getToken());
            System.out.println("StatusCode   ="+response.getStatusCode());
            System.out.println("Headers      ="+response.getHeaders());
            System.out.println("Message      ="+response.getMessage());
            System.out.println("Body         ="+response.getBody().toString());

            JSONParser p = new JSONParser();
            JSONObject obj = (JSONObject)p.parse(response.getBody());
            JSONObject objRst = (JSONObject)p.parse(obj.get("results").toString().replace("[","").replace("]",""));
            System.out.println("objRst="+objRst);

            List<FcmResponseResultItem> getResults = new ArrayList<>();

            FcmResponseResultItem resultItem = new FcmResponseResultItem();

            if (obj.get("multicast_id") != null ) {
                multicastId = obj.get("multicast_id").toString();
                sendMessage.setMulticastId(multicastId);
            }
            if (obj.get("success") != null ) {
                success = Integer.valueOf(obj.get("success").toString());
                sendMessage.setSuccess(success);
                if(success != 0 && failure == 0){
                    resultItem.setMessageId(objRst.get("message_id").toString());
                }
            }
            if (obj.get("failure") != null ) {
                failure = Integer.valueOf(obj.get("failure").toString());
                sendMessage.setFailure(failure);

                if(success == 0 && failure != 0){
                    resultItem.setError(FcmErrorType.getType(response.getStatusCode(), objRst.get("error").toString()));
                }
                getResults.add(0, resultItem);
            }
            if (obj.get("canonical_ids") != null ) {
                canonicalIds = Integer.valueOf(obj.get("canonical_ids").toString());
                sendMessage.setCanonicalIds(canonicalIds);
            };



            if (obj.get("results") != null ) {
                sendMessage.setResults(getResults);
            }
        } catch (Exception e) {
            log.error("[FAIL TO SendMessage]", e);
            throw new Exception(e);
        }

            //pushSend(PushApp pushApp, FcmMessagnulle fcmMessage);

        return sendMessage;
    }

    /**
     * FCM에 푸시 요청
     *
     * @param pushApp     앱정보
     * @param fcmMessage fcm message 정보
     * @return 전송 결과
     * @throws Exception 오류 처리
     */
    protected PushHttpResponse pushSend(List<PushAppToken> pushTokens, PushApp pushApp, FcmMessage fcmMessage)
            throws Exception {
        System.out.println("[ SenderT pushSend ] ");

        PushAppTokenDTO pushAppTokenItem = new PushAppTokenDTO();
        pushAppTokenItem.setToken(pushTokens.get(0).getToken());

        PushAppToken pushAppToken = modelMapper.map(pushAppTokenItem, PushAppToken.class);

        /**
         * TODO 14. FCM 전송 로직 구현
         */
        return new PushHttpClientBuilder()
                .setPushApp(pushApp)
                .build()
                .push(pushAppToken, fcmMessage);
    }
}
