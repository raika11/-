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
 * ?????? Job ?????? ??????
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
            //???????????? ??????
            if (pushItem.getRsvDt() != null) {
                log.info("McpDate.term(pushItem.getRsvDt())=" + McpDate.term(pushItem.getRsvDt()));
                //Thread.sleep(McpDate.term(pushItem.getRsvDt()));
            }

            /**
             *  ??????????????? ?????? ?????? ??????
             *  - ????????? ?????? ?????? ?????? ?????? ??????
             *  - status_flag ??????
             */
            PushContents contents = findPushContents(pushItem.getContentSeq());

            if (contents != null && contents
                    .getAppProcs()
                    .size() > 0) {

                /**
                 *  ?????? ??????
                 *  - ??? ???????????? ???????????? ?????? ??????
                 */
                send(contents);
            }

        } catch (Exception ex) {
            logger.error("[doTask invoke error]", ex);
        }
    }

    /**
     * ?????? ?????? ????????? ?????? ?????? ????????? ?????? ??? Sender?????? ?????? ?????? ??????
     *
     * @param pushItemSeq ?????? ????????????
     * @return ?????? ????????? ??????
     */
    protected PushContents findPushContents(Long pushItemSeq)
            throws NoDataException {

        return pushContentsService
                .findPushContentsBySeq(pushItemSeq)
                .orElseThrow(() -> new NoDataException());
    }

    /**
     * ??? Job??? ?????? ??????
     */
    protected abstract FcmMessage makePushMessage(PushContents pushContents, PushApp pushApp)
            throws Exception;

    /**
     * ????????? ????????? ????????? ??????
     *
     * @param integer ????????? ??????
     * @return ????????? ????????? ??????
     */
    private int getSyncPage(AtomicInteger integer) {
        int page = 0;
        synchronized (AbstractPushSender.class) {
            page = integer.getAndAdd(1);
        }
        return page;
    }

    /**
     * ?????? ????????? ????????? ????????????.
     *
     * @param contents ?????? ?????????
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
                 *  ?????? ????????? ??????
                 *  - ??? ???????????? ???????????? ?????? ??????
                 */
                FcmMessage pushMessage = makePushMessage(contents, proc.getPushApp());
                PushApp pushApp = proc.getPushApp();
                int appSeq = pushApp.getAppSeq();
                Long seq = proc
                        .getId()
                        .getContentSeq();

                /**
                 * ?????? ?????? ?????? ???????????? ??????
                 * - ????????? ????????? ?????? max???
                 */
                final PushAppTokenStatus tokenStatus = findAppTokenStatus(appSeq, contentSeq);

                // ?????? ?????????
                AtomicInteger currentPage = new AtomicInteger(0);
                long totalPageCnt =
                        ((tokenStatus.getTotalCount() / tokenCnt) * tokenCnt) < tokenStatus.getTotalCount() ? (tokenStatus.getTotalCount() / tokenCnt)
                                + 1 : (tokenStatus.getTotalCount() / tokenCnt);
                updateProcessing(proc, tokenStatus);
                for (int i = 0; i < threadPoolCnt; i++) {

                    /**
                     * ?????? ?????? ????????? ??????
                     */

                    int size = tokenCnt;

                    futureMap.put(completionService.submit(() -> {
                        long sendCnt = 0;
                        int page = 0;
                        try {
                            HttpPushClient pushClient = new PushHttpClientBuilder().build(propertyHolder.getFcmUrl(), pushApp.getApiKey());
                            while ((page = getSyncPage(currentPage)) < totalPageCnt) {
                                sendCnt += proccessSendJob(pushClient, proc, pushMessage, tokenStatus, page, contentSeq, pushType, tokenCnt);
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

            /** ???????????? ?????? ?????? ??????  */
            Map<Integer, Long> sendCntMap = new HashMap<>(contents
                    .getAppProcs()
                    .size());
            Future<Long> future = null;

            log.info("[ Collecting transmission results for each thread ]");
            for (int idx = 0; idx < maxThreadPoolCnt; idx++) {
                future = completionService.take();
                if (future.isDone()) {
                    int appSeq = futureMap.get(future);
                    sendCntMap.put(appSeq, sendCntMap.getOrDefault(appSeq, 0l) + future.get());
                }
            }

            /** ?????? ?????? ?????? ?????? update  */
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
     * ????????? ???????????? ????????? ??? ????????? ?????? ????????? ?????? -> ?????? -> ?????? ?????? ?????? ??????
     *
     * @param pushClient  httpClient
     * @param proc        app ?????? ??????
     * @param pushMessage ???????????????
     * @param tokenStatus ??????????????????
     * @param page        ???????????????
     * @param contentSeq  ????????? ????????????
     * @param pushType    ?????? ??????
     * @param tokenCnt    ?????? ?????? ??????
     * @return ????????????
     * @throws Exception ????????????
     */
    private int proccessSendJob(HttpPushClient pushClient, PushContentsProc proc, FcmMessage pushMessage, PushAppTokenStatus tokenStatus, int page,
            Long contentSeq, String pushType, int tokenCnt)
            throws Exception {

        /**
         * ?????? ?????? ??????????????? ??? ?????? ?????? ?????? ??????, page ?????? ??????
         * - page?????? ??????????????? ???????????? ?????? ?????? ??? ??? ????????? ??????
         * - ????????? ????????? ????????? ?????? ???????????? ?????? ?????? insert ??????
         */
        int successCnt = 0;
        int failureCnt = 0;
        PushApp pushApp = proc.getPushApp();
        Integer appSeq = proc
                .getPushApp()
                .getAppSeq();
        try {
            PushAppTokenSearchDTO searchDTO = PushAppTokenSearchDTO
                    .builder()
                    .appSeq(pushApp.getAppSeq())
                    .contentSeq(contentSeq)
                    .firstTokenSeq(tokenStatus.getFirstTokenSeq())
                    .lastTokenSeq(tokenStatus.getLastTokenSeq())
                    .pushType(pushType)
                    .pushMessage(pushMessage)
                    .build();
            searchDTO.setPage(page);
            searchDTO.setSize(tokenCnt);

            if (McpString.isNotEmpty(pushMessage.getTo())) {
                // ????????? ?????????????????? ????????? ?????? ?????? ????????? ?????? ????????? ?????? ??????
                PushResponseMessage response = sendMessage(pushClient, pushMessage, pushApp);
                successCnt = response.getSuccess();
            } else {
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
            }

        } catch (Exception e) {
            log.error("SENDER ERROR", e);
            throw e;
        }
        return successCnt;
    }

    /**
     * ??? Sender??? ?????? ?????? ?????? ??????
     *
     * @param pushAppTokenSearch ?????? ??????
     * @return
     */
    protected abstract List<PushAppToken> findAllToken(PushAppTokenSearchDTO pushAppTokenSearch)
            throws Exception;

    /**
     * ????????? ????????? ??????????????????.
     *
     * @param proc        ?????? ????????? ??? ??????
     * @param tokenStatus ?????? ??? ?????? ??????
     */
    protected void updateProcessing(final PushContentsProc proc, final PushAppTokenStatus tokenStatus) {
        log.info("[ updateProcessing - Update in progress status : getTotalCount{} ]", tokenStatus.getTotalCount());
        proc.setStartDt(McpDate.now());
        proc.setLastTokenSeq(tokenStatus.getLastTokenSeq());
        proc.setTargetCnt(tokenStatus.getTotalCount());

        pushContentsProcService.savePushContentsProc(proc);
    }

    /**
     * ?????? ????????? ??????????????????.
     *
     * @param pushContents ?????? ?????????
     */
    protected void updateFailed(final PushContents pushContents) {
        log.info("[ updateFailed - Update to failure status ]");

        pushContents.setPushYn(MokaConstants.NO);
        pushContentsService.savePushContents(pushContents);
    }

    /**
     * ?????? ????????? ????????? ?????? ????????? ??????????????????.
     *
     * @param proc ?????? ????????? ?????????
     */
    protected void updateFailed(final PushContentsProc proc) {
        log.info("[ updateFailed - Update to failure status ]");

        proc.setStatusFlag(StatusFlagType.ERROR_SENDING.getValue());

        pushContentsProcService.savePushContentsProc(proc);
    }

    /**
     * ?????? ????????? ??????????????????.
     *
     * @param pushContents ?????? ?????????
     */
    protected void updateDone(final PushContents pushContents) {
        log.info("[ updateDone - Update to complete status ]");
        pushContents.setPushYn(MokaConstants.YES);
        pushContentsService.savePushContents(pushContents);
    }

    /**
     * ?????? ???????????? ?????? ?????? ?????? ??????
     *
     * @return ?????? ??????
     */
    protected abstract PushAppTokenStatus findAppTokenStatus(Integer appSeq, Long contentSeq);

    /**
     * FCM??? ????????? ??????
     *
     * @param pushTokens  ?????? ??????
     * @param pushMessage ?????? ?????????
     * @return ?????? ??????
     */
    protected PushResponseMessage sendMessage(HttpPushClient pushClient, List<PushAppToken> pushTokens, FcmMessage pushMessage, PushApp pushApp)
            throws Exception {

        log.info("[ PushResponseMessage sendMessage ]");

        PushResponseMessage pushResponseMessage = new PushResponseMessage();

        try {
            /**
             * FCM??? ?????? ??????
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
     * FCM??? ????????? ??????
     *
     * @param pushMessage ?????? ?????????
     * @return ?????? ??????
     */
    protected PushResponseMessage sendMessage(HttpPushClient pushClient, FcmMessage pushMessage, PushApp pushApp)
            throws Exception {

        log.info("[ PushResponseMessage sendMessage ]");

        PushResponseMessage pushResponseMessage = new PushResponseMessage();

        try {
            /**
             * FCM??? ?????? ??????
             */
            PushHttpResponse response = pushClient.push(null, pushMessage);
            ;

            List<FcmResponseResultItem> results;

            log.info("PushHttpResponse : {}", response);

            if (McpString.isNotEmpty(response.getBody())) {
                pushResponseMessage = ResourceMapper
                        .getDefaultObjectMapper()
                        .readValue(response.getBody(), PushResponseMessage.class);
                AtomicInteger idx = new AtomicInteger(0);
            } else {
                log.debug("[SendMessage Empty]", response);
                results = new ArrayList<>();
                pushResponseMessage = PushResponseMessage
                        .builder()
                        .success(0)
                        .failure(1)
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
     * FCM??? ?????? ??????
     *
     * @param pushApp    ?????????
     * @param fcmMessage fcm message ??????
     * @return ?????? ??????
     * @throws Exception ?????? ??????
     */
    protected PushHttpResponse pushSend(HttpPushClient pushClient, List<PushAppToken> pushToken, PushApp pushApp, FcmMessage fcmMessage)
            throws Exception {

        List<String> registration_ids = pushToken
                .stream()
                .map(PushAppToken::getToken)
                .collect(Collectors.toList());

        fcmMessage.setRegistration_ids(registration_ids);

        /** FCM ?????? ??????  */
        return pushClient.push(null, fcmMessage);
    }

    /**
     * ?????? ???????????? ????????? ?????? ?????? ????????? ????????????.
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
     * ?????? ???????????? ????????? ?????? ????????? ????????????. ????????? ????????? sendYn??? N?????? ??????
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
        // ?????? ???????????? ????????? ?????? ?????? ?????? ??????
        updatePushAppTokenSendHist(errorTokens, appSeq, contentSeq);

        // InvalidRegistration or NotRegistered ?????? ?????? ??????
        if (propertyHolder.isErrorTokenDelete()) {
            deletePushAppToken(deleteTokens);
        }

    }

    /**
     * ????????? ?????? ?????? ?????? ?????? ?????? ?????? ?????? ?????? -> ?????? ?????? ?????? ?????? ?????? ?????? -> ?????? ?????? ?????? ?????? ?????? -> ?????? ?????? ??????
     *
     * @param deleteTokens ?????? ??? ?????? ???????????? ??????
     */
    protected void deletePushAppToken(final List<Long> deleteTokens) {
        try {
            // ????????? ????????? ????????? ?????? ????????????.
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
     * ?????? ?????? ?????? ??????
     *
     * @param errorTokens ?????? ?????? ?????? ????????????
     * @param appSeq      ??? ????????????
     * @param contentSeq  ????????? ????????????
     */
    protected void updatePushAppTokenSendHist(final List<Long> errorTokens, Integer appSeq, Long contentSeq) {
        try {
            // ????????? ????????? ????????? SEND_YN??? N?????? ????????????.
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
