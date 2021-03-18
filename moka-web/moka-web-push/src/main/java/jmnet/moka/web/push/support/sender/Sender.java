package jmnet.moka.web.push.support.sender;

import jmnet.moka.web.push.mvc.sender.entity.PushContents;

/**
 * <pre>
 * ReserveJob Job interface
 * Project : moka
 * Package : jmnet.moka.web.push.support.sender
 * ClassName : Sender
 * Created : 2021-02-05 ince
 * </pre>
 *
 * @author ince
 * @since 2021-02-05 17:38
 */
public interface Sender {

    /**
     * 초기화
     *
     * @param pushSenderJob sender 설정 정보
     */
    void init(PushSenderJob pushSenderJob);

    /**
     * 비동기 작업 처리
     *
     * @param pushItem 예약 정보
     */
    void doTask(PushContents pushItem);
}
