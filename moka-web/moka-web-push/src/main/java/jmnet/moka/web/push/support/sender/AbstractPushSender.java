package jmnet.moka.web.push.support.sender;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
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
import jmnet.moka.web.push.support.httpclient.PushHttpClientBuilder;
import jmnet.moka.web.push.support.message.FcmMessage;
import jmnet.moka.web.push.support.message.PushHttpResponse;
import jmnet.moka.web.push.support.message.PushResponseMessage;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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


    protected String success;
    protected StringBuffer scheduleDesc;

    @Override
    public void init(PushSenderJob pushSenderJob) {

        log.debug("init:", pushSenderJob);
        this.pushSenderJob = pushSenderJob;
    }



    @Override
    public void doTask(PushContents pushItem) {

        log.debug("[doTask]   ===============================================================" );
        try {
            //예약일시 체크
            if (pushItem.getRsvDt() != null) {
                log.debug("===============================================================");
                log.debug("doTask:", pushItem.getContentSeq());
                Thread.sleep(McpDate.term(pushItem.getRsvDt()));
            }

            /**
             *  TODO 1. 일련번호로 푸시 정보 조회
             *  - 데이터 존재 여부 삭제 상태 체크
             *  - status_flag 체크
             */
            log.debug("pushItem.getContentSeq()=", pushItem.getContentSeq());
            PushContents contents = findPushContents(pushItem.getContentSeq());

            log.debug("contents=", contents);

            if (contents != null && contents
                    .getAppProcs()
                    .size() > 0) {
                /**
                 *  TODO 2. 푸시 메세지 생성
                 *  - 각 업무마다 프로세스 차이 존재
                 */
                FcmMessage pushMessage = makePushMessage(pushItem.getContentSeq());

                /**
                 *  TODO 3. 전송 시작
                 *  - 각 업무마다 프로세스 차이 존재
                 */
                send(contents, pushMessage);
            }

        } catch (Exception ex) {
            logger.error("schedule invoke error ", ex);
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
    protected PushContents findPushContents(Long pushItemSeq) {

        log.debug("findPushContents=", pushItemSeq);

        Set<PushContentsProc> procs = new HashSet<>();
        procs.add(PushContentsProc
                .builder()
                .id(PushContentsProcPK
                        .builder()
                        .appSeq(1)
                        .contentSeq(pushItemSeq)
                        .build())
                .build());
        procs.add(PushContentsProc
                .builder()
                .id(PushContentsProcPK
                        .builder()
                        .appSeq(2)
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
    protected abstract FcmMessage makePushMessage(Long pushItemSeq);



    /**
     * 푸시 메시지 발송을 시작한다.
     *
     * @param contents    푸시 컨텐츠
     * @param pushMessage 푸시 메시지
     */
    protected void send(PushContents contents, FcmMessage pushMessage) {
        log.debug("AbstractPushSender send : {}", contents.getRelContentId());

        ExecutorService executorService;
        executorService = null;
        CompletionService<Boolean> completionService = null;
        int maxThreadPoolCnt = contents
                .getAppProcs()
                .size() * pushSenderJob.getThreadPoolCnt();
        executorService = Executors.newFixedThreadPool(maxThreadPoolCnt, new NamingThreadFactory(this
                .getClass()
                .getName()));
        completionService = new ExecutorCompletionService<>(executorService);

        Map<Future<Boolean>, Integer> futureMap = new HashMap<>();
        try {
            for (PushContentsProc proc : contents.getAppProcs()) {
                int appSeq = proc
                        .getId()
                        .getAppSeq();
                AtomicInteger tokenIdx = new AtomicInteger();
                for (int i = 0; i < pushSenderJob.getThreadPoolCnt(); i++) {
                    /**
                     * TODO 4. 앱별 최대 토큰 일련번호 조회
                     * - 페이징 처리를 위한 max값 
                     */
                    Long lastTokenSeq = findLastTokenSeq(appSeq);
                    log.debug("lastTokenSeq=", lastTokenSeq);
                    /**
                     * TODO 5. 앱별 푸시 쓰레드 생성
                     */
                    log.debug("appSeq=", appSeq);
                    futureMap.put(completionService.submit(() -> {
                        int pageIdx = 0;
                        while (lastTokenSeq >= (pageIdx = tokenIdx.getAndAdd(pushSenderJob.getTokenCnt()))) {
                            /**
                             * TODO 6. 앱별 푸시 쓰레드에서 각 대상 토큰 목록 조회, page 처리 필요
                             * - page별로 멀티쓰레드 생성하여 동시 발송 될 수 있도록 처리
                             * - 조회와 동시에 토큰별 이력 테이블에 이력 정보 insert 처리
                             */
                            log.debug(Thread
                                    .currentThread()
                                    .getName() + " appSeq : {},  pageIdx : {}", appSeq, pageIdx);
                            List<PushAppToken> puthTokens = findAllToken(pageIdx);

                            // 토큰 푸시 메세지 발송
                            PushResponseMessage response = sendMessage(puthTokens, pushMessage);

                            /**
                             * TODO 7. 에러 발생한 토큰 삭제 및 메시지 발송 완료 된 토큰 이력 정보 update
                             */
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
            for (int idx = 0; idx < pushSenderJob.getThreadPoolCnt(); idx++) {
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
            for (PushContentsProc proc : contents.getAppProcs()) {
                int appSeq = proc
                        .getId()
                        .getAppSeq();
                if (errorSendingSet.contains(appSeq)) {
                    updateFailed(contents.getContentSeq(), appSeq);
                } else {
                    updateDone(contents.getContentSeq(), appSeq);
                }
            }
        } catch (InterruptedException | ExecutionException e) {
            updateFailed(contents.getContentSeq(), null);
        } catch (Exception e) {
            updateFailed(contents.getContentSeq(), null);
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
     * 진행중 상태로 업데이트한다.
     *
     * @param jobKey 작업 키
     * @param appSeq 앱코드
     */
    protected void updateProcessing(final long jobKey, final Integer appSeq) {
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
    }

    /**
     * FCM에 메시지 발송
     *
     * @param puthTokens  토큰 목록
     * @param pushMessage 푸시 메시지
     * @return 전송 결과
     */
    protected PushResponseMessage sendMessage(List<PushAppToken> puthTokens, FcmMessage pushMessage) {
        /**
         * TODO 10. 메세지 발송 로직 구현
         */
        return null;
    }

    /**
     * 푸시 메시지별 토큰의 이력 정보를 등록한다.
     */
    protected void insertPushAppTokenHist() {
        /**
         * TODO 11. 푸시 토큰 이력 생성 로직 구현
         */
    }

    /**
     * 푸시 메시지별 토큰의 이력 정보를 갱신한다.
     */
    protected void updatePushAppTokenHist() {
        /**
         * TODO 12. 푸시 토큰 이력 갱신 로직 구현
         */
    }


    /**
     * 토큰 정보 삭제 처리
     *
     * @param pushTokensMemberList 삭제 해야 할 토큰 목록
     */
    protected void deleteTokens(List<PushAppToken> pushTokensMemberList) {
        /**
         * TODO 13. 에러난 토큰 삭제 로직 구현
         */
    }


    /**
     * 각 Sender별 발송 토큰 목록 조회
     *
     * @param pageIdx 페이지 Index
     * @return 토큰 목록
     */
    protected abstract List<PushAppToken> findAllToken(int pageIdx);

    /**
     * FCM에 푸시 요청
     *
     * @param mobApp     앱정보
     * @param fcmMessage fcm message 정보
     * @return 전송 결과
     * @throws Exception 오류 처리
     */
    protected PushHttpResponse pushSend(MobApp mobApp, FcmMessage fcmMessage)
            throws Exception {
        /**
         * TODO 14. FCM 전송 로직 구현
         */
        return new PushHttpClientBuilder()
                .setMobApp(mobApp)
                .build()
                .push(fcmMessage);
    }

}
