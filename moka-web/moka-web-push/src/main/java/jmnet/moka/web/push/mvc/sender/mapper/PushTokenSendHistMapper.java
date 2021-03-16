package jmnet.moka.web.push.mvc.sender.mapper;

import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.web.push.mvc.sender.vo.PushTokenBatchVO;

/**
 * <pre>
 * 푸시 토큰의 전송 이력 정보를 관리
 * Project : moka
 * Package : jmnet.moka.web.push.mvc.sender.mapper
 * ClassName : PushTokenSendHistMapper
 * Created : 2021-03-16 ince
 * </pre>
 *
 * @author ince
 * @since 2021-03-16 09:37
 */
public interface PushTokenSendHistMapper extends BaseMapper<PushTokenBatchVO, PushTokenBatchVO> {

    int insertPushTokenSendHist(PushTokenBatchVO pushTokenBatch);

    int updatePushTokenSendHist(PushTokenBatchVO pushTokenBatch);
}
