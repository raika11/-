package jmnet.moka.core.tps.mvc.poll.service;

import java.util.Optional;
import jmnet.moka.core.tps.mvc.poll.code.PollCode.PollStatusCode;
import jmnet.moka.core.tps.mvc.poll.dto.TrendpollSearchDTO;
import jmnet.moka.core.tps.mvc.poll.entity.Trendpoll;
import jmnet.moka.core.tps.mvc.poll.entity.TrendpollDetail;
import jmnet.moka.core.tps.mvc.poll.repository.TrendpollDetailRepository;
import jmnet.moka.core.tps.mvc.poll.repository.TrendpollItemRepository;
import jmnet.moka.core.tps.mvc.poll.repository.TrendpollRelateRepository;
import jmnet.moka.core.tps.mvc.poll.repository.TrendpollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
    private TrendpollRelateRepository trendpollRelateRepository;

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

        int itemCnt = trendpoll.getPollItems() != null ? trendpoll
                .getPollItems()
                .size() : 0;
        trendpoll.setItemCnt(itemCnt);
        TrendpollDetail newTrendpoll = trendpollDetailRepository.save(trendpoll);

        if (trendpoll.getPollItems() != null) {
            trendpoll
                    .getPollItems()
                    .forEach(trendpollItem -> {
                        trendpollItem.setPollSeq(newTrendpoll.getPollSeq());
                    });
        }

        if (trendpoll.getPollRelateContents() != null) {
            
        }


        return trendpollDetailRepository.save(trendpoll);
    }

    @Override
    public TrendpollDetail updateTrendpoll(TrendpollDetail trendpoll) {
        return trendpollDetailRepository.save(trendpoll);
    }


    @Override
    public long updateTrendpollStatus(Long pollSeq, PollStatusCode status) {
        return 0;
    }
}
