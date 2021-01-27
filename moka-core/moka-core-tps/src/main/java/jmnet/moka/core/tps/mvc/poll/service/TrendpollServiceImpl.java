package jmnet.moka.core.tps.mvc.poll.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import jmnet.moka.core.tps.mvc.poll.code.PollCode.PollStatusCode;
import jmnet.moka.core.tps.mvc.poll.dto.TrendpollSearchDTO;
import jmnet.moka.core.tps.mvc.poll.dto.TrendpollStatSearchDTO;
import jmnet.moka.core.tps.mvc.poll.entity.Trendpoll;
import jmnet.moka.core.tps.mvc.poll.entity.TrendpollDetail;
import jmnet.moka.core.tps.mvc.poll.entity.TrendpollVote;
import jmnet.moka.core.tps.mvc.poll.mapper.TrendpollStatMapper;
import jmnet.moka.core.tps.mvc.poll.repository.TrendpollDetailRepository;
import jmnet.moka.core.tps.mvc.poll.repository.TrendpollItemRepository;
import jmnet.moka.core.tps.mvc.poll.repository.TrendpollRelateRepository;
import jmnet.moka.core.tps.mvc.poll.repository.TrendpollRepository;
import jmnet.moka.core.tps.mvc.poll.repository.TrendpollVoteRepository;
import jmnet.moka.core.tps.mvc.poll.vo.TrendpollCntVO;
import jmnet.moka.core.tps.mvc.poll.vo.TrendpollStatVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.poll.service
 * ClassName : TrendpollServiceImpl
 * Created : 2021-01-12 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-12 15:42
 */
@Service
public class TrendpollServiceImpl implements TrendpollService {

    @Autowired
    private TrendpollRepository trendpollRepository;

    @Autowired
    private TrendpollDetailRepository trendpollDetailRepository;

    @Autowired
    private TrendpollItemRepository trendpollItemRepository;

    @Autowired
    private TrendpollVoteRepository trendpollVoteRepository;

    @Autowired
    private TrendpollRelateRepository trendpollRelateRepository;

    @Autowired
    private TrendpollStatMapper trendpollStatMapper;

    @Override
    public Page<Trendpoll> findAllTrendpoll(TrendpollSearchDTO search) {
        return trendpollRepository.findAllTrendpoll(search);
    }

    @Override
    public Optional<Trendpoll> findTrendpollBySeq(Long pollSeq) {
        return trendpollRepository.findById(pollSeq);
    }

    @Override
    public Optional<TrendpollDetail> findTrendpollDetailBySeq(Long pollSeq) {
        return trendpollDetailRepository.findById(pollSeq);
    }

    @Override
    public TrendpollDetail insertTrendpoll(TrendpollDetail trendpoll) {
        return saveTrendpollDetail(trendpoll);
    }

    @Override
    public TrendpollDetail updateTrendpoll(TrendpollDetail trendpoll) {

        if (trendpoll.getPollItems() != null && trendpoll
                .getPollItems()
                .size() > 0) {
            List<Long> exceptSeqs = trendpoll
                    .getPollItems()
                    .stream()
                    .map(value -> value.getItemSeq())
                    .collect(Collectors.toCollection(ArrayList::new));
            if (exceptSeqs != null && exceptSeqs.size() > 0) {
                trendpollRepository.deleteItemByPollSeq(trendpoll.getPollSeq(), exceptSeqs);
            }
        }
        if (trendpoll.getPollRelateContents() != null && trendpoll
                .getPollRelateContents()
                .size() > 0) {
            List<Long> exceptSeqs = trendpoll
                    .getPollRelateContents()
                    .stream()
                    .map(value -> value.getSeqNo())
                    .collect(Collectors.toCollection(ArrayList::new));
            if (exceptSeqs != null && exceptSeqs.size() > 0) {
                trendpollRepository.deleteContentsByPollSeq(trendpoll.getPollSeq(), exceptSeqs);
            }
        }

        return saveTrendpollDetail(trendpoll);
    }

    private TrendpollDetail saveTrendpollDetail(TrendpollDetail trendpoll) {
        TrendpollDetail newTrendpoll = trendpollDetailRepository.save(trendpoll);

        if (trendpoll.getPollItems() != null && trendpoll
                .getPollItems()
                .size() > 0) {
            AtomicInteger order = new AtomicInteger(1);
            trendpoll
                    .getPollItems()
                    .forEach(trendpollItem -> {
                        trendpollItem.setOrdNo(order.getAndAdd(1));
                        trendpollItem.setPollSeq(newTrendpoll.getPollSeq());
                    });
            newTrendpoll.setPollItems(trendpollItemRepository.saveAll(trendpoll.getPollItems()));
        }

        if (trendpoll.getPollRelateContents() != null && trendpoll
                .getPollRelateContents()
                .size() > 0) {
            AtomicInteger order = new AtomicInteger(1);
            trendpoll
                    .getPollRelateContents()
                    .forEach(trendpollRelate -> {
                        trendpollRelate.setOrdNo(order.getAndAdd(1));
                        trendpollRelate.setPollSeq(newTrendpoll.getPollSeq());
                    });
            newTrendpoll.setPollRelateContents(trendpollRelateRepository.saveAll(trendpoll.getPollRelateContents()));
        }
        return newTrendpoll;
    }


    @Override
    public long updateTrendpollStatus(Long pollSeq, PollStatusCode status) {
        return trendpollRepository.updateTrendpollStatus(pollSeq, status);
    }

    @Override
    public Page<TrendpollVote> findAllTrendpollVote(Long pollSeq, Pageable pageable) {
        return trendpollVoteRepository.findAllByPollSeq(pollSeq, pageable);
    }


    @Override
    public List<List<TrendpollStatVO>> findAllTrendpollVoteStat(TrendpollStatSearchDTO search) {
        return trendpollStatMapper.findByParamForMapList(search);
    }

    @Override
    public List<List<TrendpollCntVO>> findAllTrendpollVoteCnt(TrendpollStatSearchDTO search) {
        return trendpollStatMapper.findByParamForCntMapList(search);
    }


}
