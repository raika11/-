package jmnet.moka.core.common.push.service;

import jmnet.moka.common.utils.dto.ResultDTO;
import jmnet.moka.core.common.push.dto.PushSendDTO;

/**
 * <pre>
 * 모카 푸시 서버에 푸시메시지 전송 요청 Service
 * Project : moka
 * Package : jmnet.moka.core.common.push.service
 * ClassName : PushService
 * Created : 2021-03-23 ince
 * </pre>
 *
 * @author ince
 * @since 2021-03-23 07:03
 */
public interface PushSendService {

    /**
     * 푸시메시지를 전달한다.
     *
     * @param sendDTO 푸시메시지
     * @return 전송결과
     * @throws Exception 에러처리
     */
    ResultDTO<?> send(PushSendDTO sendDTO)
            throws Exception;
}
