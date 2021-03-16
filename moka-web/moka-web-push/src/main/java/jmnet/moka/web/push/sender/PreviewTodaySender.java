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
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * <pre>
 * 푸시 전송 미리보는오늘 Sender
 * Project : moka
 * Package : jmnet.moka.web.push.sender
 * ClassName : PreviewTodaySender
 * Created : 2021-02-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-08 15:33
 */
@Slf4j
@Service
public class PreviewTodaySender extends AbstractPushSender {

    private final PushAppService pushAppService;

    private final PushContentsService pushContentsService;

    private final PushContentsProcService pushContentsProcService;
    private final PushAppTokenService pushAppTokenService;

    private final PushAppTokenHistService pushAppTokenHistService;
    private final PushTokenSendHistService pushTokenSendHistService;

    @Autowired
    protected ModelMapper modelMapper;

    public PreviewTodaySender(PushAppService pushAppService, PushContentsService pushContentsService, PushContentsProcService pushContentsProcService, PushAppTokenService pushAppTokenService, PushAppTokenHistService pushAppTokenHistService, PushTokenSendHistService pushTokenSendHistService) {
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
        String pushType = null;
        String title = null;
        String content = null;
        String pushImgUrl = null;
        try{
            Page<PushContents> returnValue1 = pushContentsService.findAllByContentSeq(searchContentSeq);

            List<PushContentsDTO> dtoList1 = modelMapper.map(returnValue1.getContent(), PushContentsDTO.TYPE);

            for (PushContentsDTO pushContents : dtoList1) {
                pushType = pushContents.getPushType();
                title = pushContents.getTitle();
                content = pushContents.getContent();
                pushImgUrl = pushContents.getPushImgUrl();
            }
        } catch (Exception e) {
            log.debug(e.toString());
        }

        Optional<PushApp> pushApp = pushAppService.findByAppSeq(appSeq);

        if(pushApp.equals("iOS")){
            Notification notification = new Notification();
            notification.setTitle(title);
            notification.setBody(content);
            notification.setContent_available("true");
            notification.setMutable_content("true");
            notification.setUrl("http://dn.joongdo.co.kr");
            notification.setKey3(153);
            notification.setImage_url(pushImgUrl);

            return FcmMessage.builder().notification(notification).build();
        }else{
            Map<String, String> data = new HashMap<>();
            data.put("key1",title);
            data.put("key2",content);
            data.put("key3","http://dn.joongdo.co.kr");
            data.put("img_name",pushImgUrl);

            return FcmMessage.builder().data(data).build();
        }
    }

    @Override
    protected Long findFirstTokenSeq(Integer appSeq) {
        List<PushAppToken> appTokenList = pushAppTokenService.findByAppSeqAsc(appSeq);
        Long tokenSeq  = 0L;

        tokenSeq = appTokenList.get(0).getTokenSeq();

        return tokenSeq;
    }

    @Override
    protected Long findLastTokenSeq(Integer appSeq) {
        /**
         * TODO 2. 대상 토큰 중 가장 큰 토큰 일련번호 조회
         * - 페이징 처리에 사용
         */
        List<PushAppToken> appTokenList = pushAppTokenService.findByAppSeqDesc(appSeq);
        Long tokenSeq  = 0L;

        tokenSeq = appTokenList.get(0).getTokenSeq();

        return tokenSeq;
    }
    @Override
    protected List<PushAppToken> findAllToken(String pushType, long contentSeq, int appSeq, long lastTokenSeq, int pageIdx, int tokenCnt) throws Exception {
        log.debug("속보 - 푸시 전송을 위한 작업 처리 :findAllToken  {}", pageIdx);

        /**
         * TODO 3. 토큰 목록 조회
         */
        Page<PushAppToken> pushAppTokenlist = pushAppTokenService.findPushAppToken(appSeq, PageRequest.of(pageIdx, tokenCnt));

        int totalPages = pushAppTokenlist.getTotalPages();

        List<PushAppTokenDTO> tokenDTOList = modelMapper.map(pushAppTokenlist.getContent(), PushAppTokenDTO.TYPE);
        List<PushAppToken> returnValue = pushAppTokenlist.getContent();

        String chkToken = "";
        for (int i=0; i<tokenDTOList.size();i++) {
            if(i == 0){
                chkToken = tokenDTOList.get(i).getTokenSeq().toString();
            }else{
                chkToken = chkToken + "," + tokenDTOList.get(i).getTokenSeq();
            }
        }

        log.info("chkToken="+chkToken);

        for (PushAppTokenDTO pushAppToken : tokenDTOList) {
            try {
                log.debug("[ 푸시 앱 토큰 전송 이력 등록 ]");
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
            if(pageIdx > totalPages){
                returnValue = Collections.emptyList();
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
    protected void deleteTokens(List<PushAppToken> pushTokens) {
        pushAppTokenService.deletePushAppToken(pushTokens);
    }

    @Override
    protected PushResponseMessage sendMessage(List<PushAppToken> pushTokens, FcmMessage pushMessage) throws Exception {

        log.info("[ PreviewTodaySender PushResponseMessage sendMessage ]");

        PushResponseMessage sendMessage = new PushResponseMessage();

        for (PushAppToken pushToken : pushTokens) {

            long tokenSeq = pushToken.getTokenSeq();
            String token = pushToken.getToken();
            int appSeq = pushToken.getAppSeq();

            try {
                Optional<PushApp> pushAppOld = pushAppService.findByAppSeq(appSeq);

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
                PushHttpResponse response = pushSend(token, pushApp, pushMessage);

                String multicastId = null;
                int statusCode = response.getStatusCode();
                int success = 0;
                int failure = 0;
                int canonicalIds = 0;
                List<FcmResponseResultItem> results;

                log.info("PushToken    =" + response.getPushToken().getToken());
                log.info("StatusCode   =" + response.getStatusCode());
                log.info("Headers      =" + response.getHeaders());
                log.info("Message      =" + response.getMessage());
                log.info("Body         =" + response.getBody().toString());

                JSONParser p = new JSONParser();
                JSONObject obj = (JSONObject) p.parse(response.getBody());
                JSONObject objRst = (JSONObject) p.parse(obj.get("results").toString().replace("[", "").replace("]", ""));
                log.info("objRst=" + objRst);

                List<FcmResponseResultItem> getResults = new ArrayList<>();

                FcmResponseResultItem resultItem = new FcmResponseResultItem();

                if (obj.get("multicast_id") != null) {
                    multicastId = obj.get("multicast_id").toString();
                    sendMessage.setMulticastId(multicastId);
                }
                if (obj.get("success") != null) {
                    success = Integer.valueOf(obj.get("success").toString());
                    sendMessage.setSuccess(success);
                    if (success != 0 && failure == 0) {
                        resultItem.setMessageId(objRst.get("message_id").toString());
                    }
                }
                if (obj.get("failure") != null) {
                    failure = Integer.valueOf(obj.get("failure").toString());
                    sendMessage.setFailure(failure);

                    if (success == 0 && failure != 0) {
                        resultItem.setError(FcmErrorType.getType(response.getStatusCode(), objRst.get("error").toString()));
                    }
                    getResults.add(0, resultItem);
                }
                if (obj.get("canonical_ids") != null) {
                    canonicalIds = Integer.valueOf(obj.get("canonical_ids").toString());
                    sendMessage.setCanonicalIds(canonicalIds);
                }
                ;

                if (obj.get("results") != null) {
                    sendMessage.setResults(getResults);
                }
            } catch (Exception e) {
                log.error("[FAIL TO SendMessage]", e);
                throw new Exception(e);
            }
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
    protected PushHttpResponse pushSend(String token, PushApp pushApp, FcmMessage fcmMessage)
    //protected PushHttpResponse pushSend(List<PushAppToken> pushToken, PushApp pushApp, FcmMessage fcmMessage)
            throws Exception {
        log.info("[ PreviewTodaySender pushSend ] "+token);

        PushAppTokenDTO pushAppTokenItem = new PushAppTokenDTO();
        pushAppTokenItem.setToken(token);

        PushAppToken pushAppToken = modelMapper.map(pushAppTokenItem, PushAppToken.class);

        List<String> registration_ids = new ArrayList<String>();

        if(token.contains("f_DLCVY-ThuTc5YlVHe37o:")){
            token = token.split("f_DLCVY-ThuTc5YlVHe37o:")[1];
            token = "f_DLCVY-ThuTc5YlVHe37o:" + token;
        }

        log.info("token="+token);

        registration_ids.add(token);

        fcmMessage.setRegistration_ids(registration_ids);

        /**
         * TODO 14. FCM 전송 로직 구현
         */
        return new PushHttpClientBuilder()
                .setPushApp(pushApp)
                .build()
                .push(pushAppToken, fcmMessage);
    }
}
