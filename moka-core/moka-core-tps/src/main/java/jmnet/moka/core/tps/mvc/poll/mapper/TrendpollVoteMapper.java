package jmnet.moka.core.tps.mvc.poll.mapper;

import java.util.List;
import jmnet.moka.common.data.mybatis.support.BaseMapper;
import jmnet.moka.core.tps.mvc.poll.dto.TrendpollStatSearchDTO;
import jmnet.moka.core.tps.mvc.poll.vo.TrendpollVoteVO;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.poll.mapper
 * ClassName : TrendpollStatMapper
 * Created : 2021-01-14 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-14 09:25
 */
public interface TrendpollVoteMapper extends BaseMapper<TrendpollVoteVO, TrendpollStatSearchDTO> {

    /**
     * 통계 총 건수 조회
     *
     * @param pollSeq 검색 조건
     * @return 검색 결과
     */
    List<TrendpollVoteVO> findAllByPollSeq(String pollSeq);
}
