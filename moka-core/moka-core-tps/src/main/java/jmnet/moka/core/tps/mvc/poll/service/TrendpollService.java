package jmnet.moka.core.tps.mvc.poll.service;

import java.util.List;
import java.util.Optional;
import jmnet.moka.core.tps.mvc.poll.code.PollCode.PollStatusCode;
import jmnet.moka.core.tps.mvc.poll.dto.TrendpollSearchDTO;
import jmnet.moka.core.tps.mvc.poll.dto.TrendpollStatSearchDTO;
import jmnet.moka.core.tps.mvc.poll.entity.Trendpoll;
import jmnet.moka.core.tps.mvc.poll.entity.TrendpollDetail;
import jmnet.moka.core.tps.mvc.poll.entity.TrendpollVote;
import jmnet.moka.core.tps.mvc.poll.vo.TrendpollCntVO;
import jmnet.moka.core.tps.mvc.poll.vo.TrendpollStatVO;
import jmnet.moka.core.tps.mvc.poll.vo.TrendpollVoteVO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.poll.service
 * ClassName : TrendpollService
 * Created : 2021-01-12 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-12 15:42
 */
public interface TrendpollService {

    /**
     * 투표 목록 조회
     *
     * @param search 검색 조건
     * @return 투표 목록 조회 결과
     */
    Page<Trendpoll> findAllTrendpoll(TrendpollSearchDTO search);

    /**
     * 투표 상세 조회
     *
     * @param pollSeq 투표 일련번호
     * @return 투표 상세 정보
     */
    Optional<Trendpoll> findTrendpollBySeq(Long pollSeq);

    /**
     * 투표 상세 조회, 투표 아이템과 관련정보 목록 포함
     *
     * @param pollSeq 투표 일련번호
     * @return 투표 상세 정보
     */
    Optional<TrendpollDetail> findTrendpollDetailBySeq(Long pollSeq);

    /**
     * 투표 등록
     *
     * @param trendpoll 투표정보
     * @return 저장 된 투표 정보
     */
    TrendpollDetail insertTrendpoll(TrendpollDetail trendpoll);

    /**
     * 투표 등록
     *
     * @param trendpoll 투표정보
     * @return 저장 된 투표 정보
     */
    TrendpollDetail updateTrendpoll(TrendpollDetail trendpoll);

    /**
     * 투표 상태 변경
     *
     * @param pollSeq 투표 일련번호
     * @param status  상태값
     * @return 저장 된 투표 정보
     */
    long updateTrendpollStatus(Long pollSeq, PollStatusCode status);


    /**
     * 투표 목록 조회
     *
     * @param pollSeq 투표 일련번호
     * @return 투표 목록 조회 결과
     */
    Page<TrendpollVote> findAllTrendpollVote(Long pollSeq, Pageable pageable);


    /**
     * 투표 현황 목록 조회
     *
     * @param search 검색 조건
     * @return 투표 목록 조회 결과
     */
    List<List<TrendpollStatVO>> findAllTrendpollVoteStat(TrendpollStatSearchDTO search);

    /**
     * 투표 현황 건수 조회
     *
     * @param search 검색 조건
     * @return 투표 건수 조회 결과
     */
    List<List<TrendpollCntVO>> findAllTrendpollVoteCnt(TrendpollStatSearchDTO search);


    /**
     * 투표 목록 조회
     *
     * @param pollSeq 검색 조건
     * @return 투표 조회 결과
     */
    List<TrendpollVoteVO> findAllByPollSeq(Long pollSeq);
}
