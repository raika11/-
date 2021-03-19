package jmnet.moka.web.push.support.sender;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletionService;
import java.util.concurrent.ExecutorCompletionService;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.exception.NoDataException;
import jmnet.moka.core.common.mvc.MessageByLocale;
import jmnet.moka.core.common.util.ResourceMapper;
import jmnet.moka.web.push.config.PropertyHolder;
import jmnet.moka.web.push.mvc.sender.dto.PushAppTokenSearchDTO;
import jmnet.moka.web.push.mvc.sender.entity.PushApp;
import jmnet.moka.web.push.mvc.sender.entity.PushAppToken;
import jmnet.moka.web.push.mvc.sender.entity.PushAppTokenStatus;
import jmnet.moka.web.push.mvc.sender.entity.PushContents;
import jmnet.moka.web.push.mvc.sender.entity.PushContentsProc;
import jmnet.moka.web.push.mvc.sender.service.PushAppTokenService;
import jmnet.moka.web.push.mvc.sender.service.PushContentsProcService;
import jmnet.moka.web.push.mvc.sender.service.PushContentsService;
import jmnet.moka.web.push.mvc.sender.service.PushTokenSendHistService;
import jmnet.moka.web.push.mvc.sender.vo.PushTokenBatchVO;
import jmnet.moka.web.push.support.NamingThreadFactory;
import jmnet.moka.web.push.support.code.FcmErrorType;
import jmnet.moka.web.push.support.code.StatusFlagType;
import jmnet.moka.web.push.support.httpclient.HttpPushClient;
import jmnet.moka.web.push.support.httpclient.PushHttpClientBuilder;
import jmnet.moka.web.push.support.message.FcmMessage;
import jmnet.moka.web.push.support.message.FcmResponseResultItem;
import jmnet.moka.web.push.support.message.PushHttpResponse;
import jmnet.moka.web.push.support.message.PushResponseMessage;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * <pre>
 * 예약 Job 공통 기능
 * Project : moka
 * Package : jmnet.moka.web.push.support.sender
 * ClassName : AbstractScheduleJob
 * Created : 2021-02-05 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-05 17:38
 */
@Slf4j
public abstract class AbstractPushSender implements Sender {
    private static final Logger logger = LoggerFactory.getLogger(AbstractPushSender.class);

    protected PushSenderJob pushSenderJob;

    @Autowired
    protected ModelMapper modelMapper;

    @Autowired
    protected PushContentsService pushContentsService;

    @Autowired
    protected PushAppTokenService pushAppTokenService;

    @Autowired
    protected PushContentsProcService pushContentsProcService;

    @Autowired
    protected PushTokenSendHistService pushTokenSendHistService;

    @Autowired
    private PropertyHolder propertyHolder;

    @Autowired
    protected MessageByLocale messageByLocale;

    @Override
    public void init(PushSenderJob pushSenderJob) {
        log.debug("init: {}", pushSenderJob);
        this.pushSenderJob = pushSenderJob;
    }



    @Override
    public void doTask(PushContents pushItem) {

        log.debug(" AbstractPushSender [doTask] " + pushItem.getPushType());

        try {
            //예약일시 체크
            if (pushItem.getRsvDt() != null) {
                log.info("McpDate.term(pushItem.getRsvDt())=" + McpDate.term(pushItem.getRsvDt()));
                //Thread.sleep(McpDate.term(pushItem.getRsvDt()));
            }

            /**
             *  일련번호로 푸시 정보 조회
             *  - 데이터 존재 여부 삭제 상태 체크
             *  - status_flag 체크
             */
            PushContents contents = findPushContents(pushItem.getContentSeq());

            if (contents != null && contents
                    .getAppProcs()
                    .size() > 0) {

                /**
                 *  전송 시작
                 *  - 각 업무마다 프로세스 차이 존재
                 */
                send(contents);
            }

        } catch (Exception ex) {
            logger.error("[doTask invoke error]", ex);
        }
    }

    /**
     * 기본 푸시 컨텐츠 조회 기능 상황에 따라 각 Sender에서 별도 구현 가능
     *
     * @param pushItemSeq 푸시 일련번호
     * @return 푸시 컨텐츠 정보
     */
    protected PushContents findPushContents(Long pushItemSeq)
            throws NoDataException {

        return pushContentsService
                .findPushContentsBySeq(pushItemSeq)
                .orElseThrow(() -> new NoDataException());
    }

    /**
     * 각 Job별 기능 구현
     */
    protected abstract FcmMessage makePushMessage(PushContents contents, PushApp appSeq);

    /**
     * 페이지 번호의 동기화 유지
     *
     * @param integer 페이지 번호
     * @return 증가된 페이지 번호
     */
    private int getSyncPage(AtomicInteger integer) {
        int page = 0;
        synchronized (AbstractPushSender.class) {
            page = integer.getAndAdd(1);
        }
        return page;
    }

    /**
     * 푸시 메시지 발송을 시작한다.
     *
     * @param contents 푸시 컨텐츠
     */
    protected void send(PushContents contents) {

        int tokenCnt = pushSenderJob.getTokenCnt();
        int threadPoolCnt = pushSenderJob.getThreadPoolCnt();

        long contentSeq = contents.getContentSeq();
        String pushType = contents.getPushType();

        ExecutorService executorService;
        executorService = null;
        CompletionService<Long> completionService = null;

        int maxThreadPoolCnt = contents.getAppProcs()
                                       //.size() * pushSenderJob.getThreadPoolCnt();
                                       .size() * threadPoolCnt;
        executorService = Executors.newFixedThreadPool(maxThreadPoolCnt, new NamingThreadFactory(this
                .getClass()
                .getSimpleName()));
        completionService = new ExecutorCompletionService<>(executorService);

        Map<Future<Long>, Integer> futureMap = new HashMap<>();
        try {
            for (PushContentsProc proc : contents.getAppProcs()) {
                /**
                 *  푸시 메세지 생성
                 *  - 각 업무마다 프로세스 차이 존재
                 */
                FcmMessage pushMessage = makePushMessage(contents, proc.getPushApp());
                PushApp pushApp = proc.getPushApp();
                int appSeq = pushApp.getAppSeq();
                Long seq = proc
                        .getId()
                        .getContentSeq();

                /**
                 * 앱별 최대 토큰 일련번호 조회
                 * - 페이징 처리를 위한 max값
                 */
                final PushAppTokenStatus tokenStatus = findAppTokenStatus(appSeq, contentSeq);

                // 현재 페이지
                AtomicInteger currentPage = new AtomicInteger(0);
                long totalPageCnt =
                        ((tokenStatus.getTotalCount() / tokenCnt) * tokenCnt) < tokenStatus.getTotalCount() ? (tokenStatus.getTotalCount() / tokenCnt)
                                + 1 : (tokenStatus.getTotalCount() / tokenCnt);
                updateProcessing(proc, tokenStatus);
                for (int i = 0; i < threadPoolCnt; i++) {

                    /**
                     * 앱별 푸시 쓰레드 생성
                     */

                    int size = tokenCnt;

                    futureMap.put(completionService.submit(() -> {
                        long sendCnt = 0;
                        int page = 0;
                        try {
                            HttpPushClient pushClient = new PushHttpClientBuilder().build(propertyHolder.getFcmUrl(), pushApp.getApiKey());
                            while ((page = getSyncPage(currentPage)) < totalPageCnt) {
                                sendCnt += proccessSendJob(pushClient, pushApp, pushMessage, tokenStatus, page, contentSeq, pushType, tokenCnt);
                            }
                        } catch (Exception e) {
                            log.debug("[Exception] thread id : {} - send start appSeq : {},  currentPage : {}", Thread
                                    .currentThread()
                                    .getName(), appSeq, page);
                            throw e;
                        }
                        log.debug("sendCnt {}", sendCnt);
                        return sendCnt;
                    }), appSeq);
                }
            }

            /** 쓰레드별 전송 결과 취합  */
            Map<Integer, Long> sendCntMap = new HashMap<>(contents
                    .getAppProcs()
                    .size());
            Future<Long> future = null;

            log.info("[ Collecting transmission results for each thread ]");
            for (int idx = 0; idx < threadPoolCnt; idx++) {
                future = completionService.take();
                if (future.isDone()) {
                    int appSeq = futureMap.get(future);
                    sendCntMap.put(appSeq, sendCntMap.getOrDefault(appSeq, 0l) + future.get());
                }
            }

            /** 앱별 푸시 전송 결과 update  */
            log.info("[ Update of push transmission result for each app ]");
            for (PushContentsProc proc : contents.getAppProcs()) {
                int appSeq = proc
                        .getId()
                        .getAppSeq();

                if (sendCntMap.containsKey(appSeq)) {
                    proc.setSendCnt(sendCntMap.get(appSeq));
                    proc.setEndDt(McpDate.now());
                    proc.setStatusFlag(StatusFlagType.DONE.getValue());
                    pushContentsProcService.savePushContentsProc(proc);
                }
            }
        } catch (InterruptedException e) {
            for (PushContentsProc proc : contents.getAppProcs()) {
                int appSeq = proc
                        .getId()
                        .getAppSeq();

                log.debug("appSeq : {},  InterruptedException : {}", appSeq, e);
                updateFailed(proc);
            }
        } catch (Exception e) {
            for (PushContentsProc proc : contents.getAppProcs()) {
                int appSeq = proc
                        .getId()
                        .getAppSeq();

                log.debug("appSeq : {},  Exception : {}", appSeq, e);
                updateFailed(proc);
            }
        } finally {
            try {
                updateDone(contents);

                executorService.awaitTermination(500, TimeUnit.MILLISECONDS);

                if (!executorService.isTerminated()) {
                    executorService.shutdownNow();
                    executorService = null;
                }
            } catch (InterruptedException e) {
                log.debug(e.toString());
            } catch (Exception e) {
                log.debug(e.toString());
            }
        }
    }

    /**
     * 쓰레드 내부에서 페이징 한 토큰을 전송 이력에 저장 -> 전송 -> 전송 결과 저장 처리
     *
     * @param pushClient  httpClient
     * @param pushApp     app 정보
     * @param pushMessage 푸시메시지
     * @param tokenStatus 토큰상태정보
     * @param page        페이지번호
     * @param contentSeq  컨텐츠 일련번호
     * @param pushType    푸시 유형
     * @param tokenCnt    토큰 조회 건수
     * @return 성공건수
     * @throws Exception 에러처리
     */
    private int proccessSendJob(HttpPushClient pushClient, PushApp pushApp, FcmMessage pushMessage, PushAppTokenStatus tokenStatus, int page,
            Long contentSeq, String pushType, int tokenCnt)
            throws Exception {

        /**
         * 앱별 푸시 쓰레드에서 각 대상 토큰 목록 조회, page 처리 필요
         * - page별로 멀티쓰레드 생성하여 동시 발송 될 수 있도록 처리
         * - 조회와 동시에 토큰별 이력 테이블에 이력 정보 insert 처리
         */
        int successCnt = 0;
        int failureCnt = 0;
        Integer appSeq = pushApp.getAppSeq();
        try {
            PushAppTokenSearchDTO searchDTO = PushAppTokenSearchDTO
                    .builder()
                    .appSeq(pushApp.getAppSeq())
                    .contentSeq(contentSeq)
                    .firstTokenSeq(tokenStatus.getFirstTokenSeq())
                    .lastTokenSeq(tokenStatus.getLastTokenSeq())
                    .pushType(pushType)
                    .build();
            searchDTO.setPage(page);
            searchDTO.setSize(tokenCnt);
            log.debug("thread id : {} - findAllToken start appSeq : {},  currentPage : {}", Thread
                    .currentThread()
                    .getName(), appSeq, page);
            final List<PushAppToken> pushTokens = findAllToken(searchDTO);
            log.debug("thread id : {} - findAllToken end appSeq : {},  currentPage : {}", Thread
                    .currentThread()
                    .getName(), appSeq, page);

            if (pushTokens != null && pushTokens.size() > 0) {
                log.debug("thread id : {} - insertToken start appSeq : {},  currentPage : {}", Thread
                        .currentThread()
                        .getName(), appSeq, page);
                insertPushAppTokenSendHist(appSeq, contentSeq, pushTokens);
                log.debug("thread id : {} - insertToken end appSeq : {},  currentPage : {}", Thread
                        .currentThread()
                        .getName(), appSeq, page);
                log.debug("thread id : {} - sendMessage start appSeq : {},  currentPage : {}", Thread
                        .currentThread()
                        .getName(), appSeq, page);
                PushResponseMessage response = sendMessage(pushClient, pushTokens, pushMessage, pushApp);
                successCnt = response.getSuccess();
                log.debug("thread id : {} - sendMessage end appSeq : {},  currentPage : {},  successCnt : {}", Thread
                        .currentThread()
                        .getName(), appSeq, page, successCnt);
                log.debug("thread id : {} - updateToken start appSeq : {},  currentPage : {}", Thread
                        .currentThread()
                        .getName(), appSeq, page);
                updatePushAppToken(appSeq, contentSeq, pushTokens, response);
                log.debug("thread id : {} - updateToken end appSeq : {},  currentPage : {}", Thread
                        .currentThread()
                        .getName(), appSeq, page);
            }

        } catch (Exception e) {
            log.error("SENDER ERROR", e);
            throw e;
        }
        return successCnt;
    }

    /**
     * 각 Sender별 발송 토큰 목록 조회
     *
     * @param pushAppTokenSearch 검색 정보
     * @return
     */
    protected abstract List<PushAppToken> findAllToken(PushAppTokenSearchDTO pushAppTokenSearch)
            throws Exception;

    /**
     * 진행중 상태로 업데이트한다.
     *
     * @param proc        푸시 컨텐츠 앱 정보
     * @param tokenStatus 푸시 앱 토큰 정보
     */
    protected void updateProcessing(final PushContentsProc proc, final PushAppTokenStatus tokenStatus) {
        log.info("[ updateProcessing - Update in progress status : getTotalCount{} ]", tokenStatus.getTotalCount());
        proc.setStartDt(McpDate.now());
        proc.setLastTokenSeq(tokenStatus.getLastTokenSeq());
        proc.setTargetCnt(tokenStatus.getTotalCount());

        pushContentsProcService.savePushContentsProc(proc);
    }

    /**
     * 실패 상태로 업데이트한다.
     *
     * @param pushContents 푸시 컨텐츠
     */
    protected void updateFailed(final PushContents pushContents) {
        log.info("[ updateFailed - Update to failure status ]");

        pushContents.setPushYn(MokaConstants.NO);
        pushContentsService.savePushContents(pushContents);
    }

    /**
     * 푸시 컨텐츠 앱정보 실패 상태로 업데이트한다.
     *
     * @param proc 푸시 컨텐츠 앱정보
     */
    protected void updateFailed(final PushContentsProc proc) {
        log.info("[ updateFailed - Update to failure status ]");

        proc.setStatusFlag(StatusFlagType.ERROR_SENDING.getValue());

        pushContentsProcService.savePushContentsProc(proc);
    }

    /**
     * 완료 상태로 업데이트한다.
     *
     * @param pushContents 푸시 컨텐츠
     */
    protected void updateDone(final PushContents pushContents) {
        log.info("[ updateDone - Update to complete status ]");

        pushContents.setPushYn(MokaConstants.YES);

        pushContentsService.savePushContents(pushContents);
    }

    /**
     * 푸시 컨텐츠별 최대 토큰 건수 조회
     *
     * @return 토큰 목록
     */
    protected abstract PushAppTokenStatus findAppTokenStatus(Integer appSeq, Long contentSeq);

    /**
     * FCM에 메시지 발송
     *
     * @param pushTokens  토큰 목록
     * @param pushMessage 푸시 메시지
     * @return 전송 결과
     */
    protected PushResponseMessage sendMessage(HttpPushClient pushClient, List<PushAppToken> pushTokens, FcmMessage pushMessage, PushApp pushApp)
            throws Exception {

        log.info("[ PushResponseMessage sendMessage ]");

        PushResponseMessage pushResponseMessage = new PushResponseMessage();

        try {
            /**
             * FCM에 푸시 요청
             */
            PushHttpResponse response = pushSend(pushClient, pushTokens, pushApp, pushMessage);

            List<FcmResponseResultItem> results;

            log.info("PushHttpResponse : {}", response);

            if (McpString.isNotEmpty(response.getBody())) {
                pushResponseMessage = ResourceMapper
                        .getDefaultObjectMapper()
                        .readValue(response.getBody(), PushResponseMessage.class);
                AtomicInteger idx = new AtomicInteger(0);
                for (FcmResponseResultItem item : pushResponseMessage.getResults()) {
                    item.setMessageId(String.valueOf(pushTokens
                            .get(idx.getAndAdd(1))
                            .getTokenSeq()));
                }
            } else {
                log.debug("[SendMessage Empty]", response);
                results = new ArrayList<>();
                for (PushAppToken token : pushTokens) {
                    results.add(FcmResponseResultItem
                            .builder()
                            .messageId(String.valueOf(token.getTokenSeq()))
                            .error(FcmErrorType.InternalServerError)
                            .build());

                }
                pushResponseMessage = PushResponseMessage
                        .builder()
                        .success(0)
                        .failure(pushTokens.size())
                        .results(results)
                        .build();
            }
        } catch (Exception e) {
            log.error("[FAIL TO SendMessage]", e);
            throw new Exception(e);
        }
        return pushResponseMessage;
    }

    /**
     * FCM에 푸시 요청
     *
     * @param pushApp    앱정보
     * @param fcmMessage fcm message 정보
     * @return 전송 결과
     * @throws Exception 오류 처리
     */
    protected PushHttpResponse pushSend(HttpPushClient pushClient, List<PushAppToken> pushToken, PushApp pushApp, FcmMessage fcmMessage)
            throws Exception {

        List<String> registration_ids = pushToken
                .stream()
                .map(PushAppToken::getToken)
                .collect(Collectors.toList());

        fcmMessage.setRegistration_ids(registration_ids);

        /** FCM 전송 로직  */
        return pushClient.push(null, fcmMessage);
    }

    /**
     * 푸시 메시지별 토큰의 전송 이력 정보를 등록한다.
     */
    protected void insertPushAppTokenSendHist(Integer appSeq, Long contentSeq, List<PushAppToken> pushTokens)
            throws Exception {

        String tokens = pushTokens
                .stream()
                .map(pushAppToken -> String.valueOf(pushAppToken.getTokenSeq()))
                .reduce((result, tokenSeq) -> result + "," + String.valueOf(tokenSeq))
                .get();

        try {
            pushTokenSendHistService.insertPushTokenSendHistBatch(PushTokenBatchVO
                    .builder()
                    .appSeq(appSeq)
                    .contentsSeq(contentSeq)
                    .tokenSeqs(tokens)
                    .build());
        } catch (Exception e) {
            String message = messageByLocale.get("wpush.error.pushTokenSendHist.insert");
            throw new Exception(message, e);
        }
    }

    /**
     * 푸시 메시지별 토큰의 이력 정보를 갱신한다. 실패한 토큰만 sendYn을 N으로 변경
     */
    protected void updatePushAppToken(Integer appSeq, Long contentSeq, List<PushAppToken> pushTokens, PushResponseMessage response)
            throws Exception {

        final List<Long> errorTokens = new ArrayList<>();
        final List<Long> deleteTokens = new ArrayList<>();
        try {
            int itemSize = response
                    .getResults()
                    .size();
            for (int i = 0; i < itemSize; i++) {
                FcmResponseResultItem item = response
                        .getResults()
                        .get(i);
                if (FcmErrorType.isError(item.getError())) {
                    errorTokens.add(Long.parseLong(item.getMessageId()));
                }
                if (FcmErrorType.isDeviceDelete(item.getError())) {
                    deleteTokens.add(Long.parseLong(item.getMessageId()));
                }
            }
        } catch (Exception ex) {
            String message = messageByLocale.get("wpush.error.pushTokenSendHist.update");
            throw new Exception(message, ex);
        }
        // 푸시 컨텐츠의 토큰별 전송 오류 이력 수정
        updatePushAppTokenSendHist(errorTokens, appSeq, contentSeq);

        // InvalidRegistration or NotRegistered 토큰 삭제 처리
        if (propertyHolder.isErrorTokenDelete()) {
            deletePushAppToken(deleteTokens);
        }

    }

    /**
     * 에러난 푸시 토큰 삭제 처리 푸시 토큰 이력 등록 -> 푸시 토큰 설정 정보 이력 등록 -> 푸시 토큰 설정 정보 삭제 -> 푸시 토큰 삭제
     *
     * @param deleteTokens 삭제 할 토큰 일련번호 목록
     */
    protected void deletePushAppToken(final List<Long> deleteTokens) {
        try {
            // 오류가 발생한 토큰은 삭제 처리한다.
            if (deleteTokens != null && deleteTokens.size() > 0) {
                try {
                    pushAppTokenService.deletePushAppToken(McpString.collectionToDelimitedString(deleteTokens, ","));
                } catch (Exception e) {
                    String message = messageByLocale.get("wpush.error.pushTokenSendHist.delete");
                    throw new Exception(message, e);
                }
            }
        } catch (Exception ex) {
            String message = messageByLocale.get("wpush.error.pushTokenSendHist.delete");
            log.error(message, ex);
        }
    }

    /**
     * 전송 이력 정보 수정
     *
     * @param errorTokens 오류 발생 토큰 일련번호
     * @param appSeq      앱 일련번호
     * @param contentSeq  컨텐츠 일련번호
     */
    protected void updatePushAppTokenSendHist(final List<Long> errorTokens, Integer appSeq, Long contentSeq) {
        try {
            // 오류가 발생한 토큰은 SEND_YN을 N으로 수정한다.
            if (errorTokens != null && errorTokens.size() > 0) {
                try {
                    pushTokenSendHistService.updatePushTokenSendHistBatch(PushTokenBatchVO
                            .builder()
                            .appSeq(appSeq)
                            .contentsSeq(contentSeq)
                            .tokenSeqs(McpString.collectionToDelimitedString(errorTokens, ","))
                            .sendYn(MokaConstants.NO)
                            .build());
                } catch (Exception e) {
                    String message = messageByLocale.get("wpush.error.pushTokenSendHist.update");
                    throw new Exception(message, e);
                }
            }
        } catch (Exception ex) {
            String message = messageByLocale.get("wpush.error.pushTokenSendHist.update");
            log.error(message, ex);
        }
    }
}
