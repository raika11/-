package jmnet.moka.web.push.support.sender;

import java.util.*;
import java.util.concurrent.CompletionService;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorCompletionService;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.web.push.mvc.sender.entity.*;
import jmnet.moka.web.push.support.NamingThreadFactory;
import jmnet.moka.web.push.support.code.StatusFlagType;
import jmnet.moka.web.push.support.message.FcmMessage;
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

    protected String success;
    protected StringBuffer scheduleDesc;

    @Override
    public void init(PushSenderJob pushSenderJob) {
        log.debug("init:", pushSenderJob);
        this.pushSenderJob = pushSenderJob;
    }



    @Override
    public void doTask(PushContents pushItem, Integer appSeq) {

        log.debug(" AbstractPushSender [doTask] ");

        try {
            //예약일시 체크
            if (pushItem.getRsvDt() != null) {
                log.info("McpDate.term(pushItem.getRsvDt())="+McpDate.term(pushItem.getRsvDt()));
                //Thread.sleep(McpDate.term(pushItem.getRsvDt()));
            }

            /**
             *  TODO 1. 일련번호로 푸시 정보 조회
             *  - 데이터 존재 여부 삭제 상태 체크
             *  - status_flag 체크
             */
            PushContents contents = findPushContents(pushItem.getContentSeq(), appSeq);

            if (contents != null && contents
                    .getAppProcs()
                    .size() > 0) {
                /**
                 *  TODO 2. 푸시 메세지 생성
                 *  - 각 업무마다 프로세스 차이 존재
                 */
                FcmMessage pushMessage = makePushMessage(pushItem.getContentSeq(), appSeq);

                /**
                 *  TODO 3. 전송 시작
                 *  - 각 업무마다 프로세스 차이 존재
                 */
                send(contents, pushMessage);
            }

        } catch (Exception ex) {
            logger.error("doTask invoke error ", ex);
        } finally {
            finish();
        }
    }

    /**
     * 기본 푸시 컨텐츠 조회 기능 상황에 따라 각 Sender에서 별도 구현 가능
     *
     * @param pushItemSeq 푸시 일련번호
     * @return 푸시 컨텐츠 정보
     */
    protected PushContents findPushContents(Long pushItemSeq, int appSeq) {
        log.info("pushItemSeq ="+pushItemSeq);
        log.info("appSeq      ="+appSeq);

        Set<PushContentsProc> procs = new HashSet<>();
        procs.add(PushContentsProc
                .builder()
                .id(PushContentsProcPK
                        .builder()
                        .appSeq(appSeq)
                        .contentSeq(pushItemSeq)
                        .build())
                .build());
        return PushContents
                .builder()
                .contentSeq(pushItemSeq)
                .appProcs(procs)
                .build();
    }

    /**
     * 각 Job별 기능 구현
     */
    protected abstract FcmMessage makePushMessage(Long pushItemSeq, int appSeq);

    /**
     * 푸시 메시지 발송을 시작한다.
     *
     * @param contents    푸시 컨텐츠
     * @param pushMessage 푸시 메시지
     */
    protected void send(PushContents contents, FcmMessage pushMessage) {

        int tokenCnt = 1000;
        int threadPoolCnt = 10;

        long contentSeq = contents.getContentSeq();
        String pushType = contents.getPushType();

        ExecutorService executorService;
        executorService = null;
        CompletionService<Boolean> completionService = null;

        int maxThreadPoolCnt = contents
                .getAppProcs()
                //.size() * pushSenderJob.getThreadPoolCnt();
                .size() * threadPoolCnt;
        executorService = Executors.newFixedThreadPool(maxThreadPoolCnt, new NamingThreadFactory(this
                .getClass()
                .getName()));
        completionService = new ExecutorCompletionService<>(executorService);

        log.info("maxThreadPoolCnt="+maxThreadPoolCnt);

        Map<Future<Boolean>, Integer> futureMap = new HashMap<>();
        try {
            for (PushContentsProc proc : contents.getAppProcs()) {
                int appSeq = proc
                        .getId()
                        .getAppSeq();
                Long seq = proc
                        .getId()
                        .getContentSeq();

                log.info("[ futureMap PushContentsProc ]");
                log.info("contentSeq  ="+seq);
                log.info("appSeq      ="+appSeq);

                AtomicInteger tokenIdx = new AtomicInteger();

                log.info("tokenIdx="+tokenIdx);

                for (int i = 0; i < threadPoolCnt; i++) {

                    //for (int i = 0; i < pushSenderJob.getThreadPoolCnt(); i++) {
                    /**
                     * TODO 4. 앱별 최대 토큰 일련번호 조회
                     * - 페이징 처리를 위한 max값 
                     */

                    Long firstTokenSeq = findFirstTokenSeq(appSeq);
                    Long lastTokenSeq = findLastTokenSeq(appSeq);
                    log.info("firstTokenSeq   ="+firstTokenSeq);
                    log.info("lastTokenSeq    ="+lastTokenSeq);

                    /**
                     * TODO 5. 앱별 푸시 쓰레드 생성
                     */

                    int size = tokenCnt;
                    // 현재 페이지
                    AtomicInteger currentPage = new AtomicInteger(1);


                futureMap.put(completionService.submit(() -> {

                        int tokenRstIdx = 0;
                        //int pageIdx = 1;
                         while (lastTokenSeq >= (tokenRstIdx = tokenIdx.getAndAdd(tokenCnt))) {
                             log.info("lastTokenSeq ="+ lastTokenSeq);
                             log.info("tokenRstIdx  ="+ tokenRstIdx);
                             log.info("tokenCnt     ="+ tokenCnt);

                             /**
                              * TODO 6. 앱별 푸시 쓰레드에서 각 대상 토큰 목록 조회, page 처리 필요
                              * - page별로 멀티쓰레드 생성하여 동시 발송 될 수 있도록 처리
                              * - 조회와 동시에 토큰별 이력 테이블에 이력 정보 insert 처리
                              */
                             log.debug(Thread
                                     .currentThread()
                                     .getName() + " appSeq : {},  pageIdx : {}", appSeq, tokenRstIdx);
                           // log.info("lastTokenSeq="+lastTokenSeq + ": pageIdx="+pageIdx+": tokenCnt ="+tokenIdx.getAndAdd(tokenCnt));

                            try {
                                List<PushAppToken> pushApplist = findAllToken(pushType, contentSeq, appSeq, lastTokenSeq, currentPage.getAndAdd(1), tokenCnt);

                                log.info("[ 토큰 푸시 메세지 발송 Start ] ");
                                log.info("pushApplist.get(0).getTokenSeq()  ="+ pushApplist.get(0).getTokenSeq());
                                log.info("pushApplist.get(0).getTokenSeq()  ="+ pushApplist.get(0).getToken());

                                PushResponseMessage response = sendMessage(pushApplist, pushMessage);

                                log.info("getMulticastId  ="+ response.getMulticastId());
                                log.info("getSuccess      ="+ response.getSuccess());
                                log.info("getFailure      ="+ response.getFailure());
                                log.info("getCanonicalIds ="+ response.getCanonicalIds());
                                log.info("getMessageId    ="+ response.getResults().get(0).getMessageId());
                                log.info("getError        ="+ response.getResults().get(0).getError());

                                if(pushApplist.isEmpty()) {
                                    log.info("최대 페이지까지 조회되었습니다.");
                                    break;
                                }

                            } catch (Exception e) {
                                log.error(String.valueOf(e));
                                throw new Exception(e);
                            }
                            /**
                             * TODO 7. 에러 발생한 토큰 삭제 및 메시지 발송 완료 된 토큰 이력 정보 update
                             */
                            //   deleteTokens(pushTokens);


                        }
                        return true;
                    }), appSeq);
                }
            }

            /**
             * TODO 6. 쓰레드별 전송 결과 취합
             */
            Set<Integer> errorSendingSet = new HashSet<>(contents
                    .getAppProcs()
                    .size());
            Future<Boolean> future = null;

            log.info("쓰레드별 전송 결과 취합");

            for (int idx = 0; idx < threadPoolCnt; idx++) {
                //for (int idx = 0; idx < pushSenderJob.getThreadPoolCnt(); idx++) {
                future = completionService.take();
                if (!future.get()) {
                    log.debug("{} 정상 종료되지 않은 Token이 있습니다.", Thread
                            .currentThread()
                            .getName());
                    errorSendingSet.add(futureMap.get(future));
                }
            }
            /**
             * TODO 7. 앱별 푸시 전송 결과 update
             */

            log.info("앱별 푸시 전송 결과 update");


            for (PushContentsProc proc : contents.getAppProcs()) {
                int appSeq = proc
                        .getId()
                        .getAppSeq();

                log.info("appSeq="+appSeq);

                if (errorSendingSet.contains(appSeq)) {
                    updateFailed(contents.getContentSeq(), appSeq);
                } else {
                    updateDone(contents.getContentSeq(), appSeq);
                }
            }

        } catch (InterruptedException | ExecutionException e) {
            //updateFailed(contents.getContentSeq(), null);
            for (PushContentsProc proc : contents.getAppProcs()) {
                int appSeq = proc
                        .getId()
                        .getAppSeq();

                log.info("appSeq="+appSeq);
                updateFailed(contents.getContentSeq(), appSeq);
            }
        } catch (Exception e) {
            //updateFailed(contents.getContentSeq(), null);
            for (PushContentsProc proc : contents.getAppProcs()) {
                int appSeq = proc
                        .getId()
                        .getAppSeq();

                log.info("appSeq="+appSeq);
                updateFailed(contents.getContentSeq(), appSeq);
            }
        } finally {
            try {
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
     * 각 Sender별 발송 토큰 목록 조회
     *
     * @param pageIdx 페이지 Index
     * @return
     */
    protected abstract List<PushAppToken> findAllToken(String pushType, long contentSeq, int appSeq, long lastTokenSeq, int pageIdx, int tokenCnt) throws Exception;

    /**
     * 진행중 상태로 업데이트한다.
     *
     * @param jobKey 작업 키
     * @param appSeq 앱코드
     */
    protected void updateProcessing(final long jobKey, final Integer appSeq) {
        log.info("[ updateProcessing 진행중 상태로 업데이트한다. ]");
        log.info("jobKey="+jobKey);
        log.info("appSeq="+appSeq);
        log.debug("{} send failed pushSeq: {} appSeq: {}", Thread
                .currentThread()
                .getName(), jobKey, appSeq);
        updateStatus(jobKey, appSeq, StatusFlagType.SENDING);
    }



    /**
     * 실패 상태로 업데이트한다.
     *
     * @param jobKey 작업 키
     * @param appSeq 앱코드
     */
    protected void updateFailed(final long jobKey, final Integer appSeq) {
        log.info("[ updateFailed 실패 상태로 업데이트한다. ]");
        log.info("jobKey="+jobKey);
        log.info("appSeq="+appSeq);
        log.debug("{} send failed pushSeq: {} appSeq: {}", Thread
                .currentThread()
                .getName(), jobKey, appSeq);
        updateStatus(jobKey, appSeq, StatusFlagType.ERROR_SENDING);
    }

    /**
     * 완료 상태로 업데이트한다.
     *
     * @param jobKey 작업 키
     * @param appSeq 앱코드
     */
    protected void updateDone(final long jobKey, final Integer appSeq) {
        log.info("[ updateDone 완료 상태로 업데이트한다. ]");
        log.info("jobKey="+jobKey);
        log.info("appSeq="+appSeq);

        log.debug("{} send done pushSeq: {} appSeq: {}", Thread
                .currentThread()
                .getName(), jobKey, appSeq);
        updateStatus(jobKey, appSeq, StatusFlagType.DONE);
    }

    /**
     * 상태를 업데이트한다.
     *
     * @param pushItemSeq 작업 키
     * @param appSeq      앱일련번호
     * @param status      상태코드
     */
    protected void updateStatus(final long pushItemSeq, final Integer appSeq, final StatusFlagType status) {
        /**
         * TODO 8. 앱별 전송 이력 갱신 로직 구현
         */
    }

    /**
     * 앱별 최소 토큰 일련번호 조회
     *
     * @return 토큰 목록
     */
    protected abstract Long findFirstTokenSeq(Integer appSeq);
    /**
     * 앱별 최대 토큰 일련번호 조회
     *
     * @return 토큰 목록
     */
    protected abstract Long findLastTokenSeq(Integer appSeq);


    /**
     * 마무리 처리
     */
    public void finish() {
        /**
         * TODO 9. 마무리 로직 필요시 구현
         */
        log.info(" [ 마무리 로직 필요시 구현 ] finish");
    }

    /**
     * FCM에 메시지 발송
     *
     * @param pushTokens  토큰 목록
     * @param pushMessage 푸시 메시지
     * @return 전송 결과
     */
    protected abstract PushResponseMessage sendMessage(List<PushAppToken> pushTokens, FcmMessage pushMessage) throws Exception;

    /**
     * 푸시 메시지별 토큰의 전송 이력 정보를 등록한다.
     */
    protected void insertPushTokenSendHist(PushTokenSendHist pushTokenSendHist) {
    }
    /**
     * 푸시 메시지별 토큰의 이력 정보를 등록한다.
     */
    protected void insertPushAppTokenHist(PushAppTokenHist pushAppTokenHist) {
        /**
         * TODO 11. 푸시 토큰 이력 생성 로직 구현
         */
    }

    /**
     * 푸시 메시지별 토큰의 이력 정보를 갱신한다.
     */
    protected void updatePushAppTokenHist(PushAppTokenHist pushAppTokenHist) {
        /**
         * TODO 12. 푸시 토큰 이력 갱신 로직 구현
         */
    }


    /**
     * 토큰 정보 삭제 처리
     *
     * @param pushTokens 삭제 해야 할 토큰 목록
     */
    protected void deleteTokens(List<PushAppToken> pushTokens) {
        /**
         * TODO 13. 에러난 토큰 삭제 로직 구현
         */
    }

    /**
     * FCM에 푸시 요청
     *
     * @param pushApp     앱정보
     * @param fcmMessage fcm message 정보
     * @return 전송 결과
     * @throws Exception 오류 처리
     */
    protected PushHttpResponse pushSend(List<PushAppToken> pushTokens, PushApp pushApp, FcmMessage fcmMessage) throws Exception {
        return null;
    }
}
