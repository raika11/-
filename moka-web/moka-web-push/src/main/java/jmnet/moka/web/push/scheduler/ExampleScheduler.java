package jmnet.moka.web.push.scheduler;

import jmnet.moka.web.push.mvc.sender.entity.MobPushItem;
import jmnet.moka.web.push.support.scheduler.AbstractScheduler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * <pre>
 * 일정 시간에 컨텐츠를 푸시 요청하는 스케줄러 예제
 * Project : moka
 * Package : jmnet.moka.web.push.scheduler
 * ClassName : ExampleScheduler
 * Created : 2021-02-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-08 15:33
 */
@Slf4j
@Component
public class ExampleScheduler extends AbstractScheduler {


    @Override
    public void invoke() {

        log.debug("설정 시간에 활성화되어 푸시 컨텐츠 조회 후 컨텐츠가 있을 경우 메세지를 전송하는 스케줄러");

        // todo 1. 푸시 대상 컨텐츠 조회

        // todo 2. TB_PUSH_CONTENTS에 푸시 정보 등록

        /**
         * todo 3. TB_PUSH_CONTENTS_PROC에 앱별 푸시 상태 정보 등록
         * - status_flag = '0'
         **/

        /**
         * 푸시 작업 등록
         */
        MobPushItem pushItem = MobPushItem
                .builder()
                .build();
        boolean success = pushSenderHandler.addPushJob(pushItem);
    }
}
