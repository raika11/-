package jmnet.moka.web.push.mvc.sender.repository;

import com.querydsl.jpa.JPQLQuery;
import java.util.Optional;
import jmnet.moka.web.push.mvc.sender.entity.PushContents;
import jmnet.moka.web.push.mvc.sender.entity.QPushContents;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.web.push.mvc.sender.repository
 * ClassName : PushContentsRepositorySupportImpl
 * Created : 2021-03-16 ince
 * </pre>
 *
 * @author ince
 * @since 2021-03-16 19:44
 */
public class PushContentsRepositorySupportImpl extends QuerydslRepositorySupport implements PushContentsRepositorySupport {


    public PushContentsRepositorySupportImpl() {
        super(PushContents.class);
    }

    @Override
    public Optional<PushContents> findByRelContentId(Long relContentId) {
        QPushContents qPushContents = QPushContents.pushContents;
        JPQLQuery<PushContents> query = from(qPushContents);

        query
                .where(qPushContents.relContentId.eq(relContentId))
                .limit(1)
                .orderBy(qPushContents.contentSeq.desc())
                .fetch();

        PushContents pushContents = query.fetchFirst();

        return Optional.ofNullable(pushContents);
    }

    @Override
    public Page<PushContents> findByRelContentId(Long search, Pageable pageable) {
        return null;
    }

    @Override
    public Page<PushContents> findByContentSeq(Long contentSeq, Pageable pageable) {
        return null;
    }

    @Override
    public Page<PushContents> findAllByUsedYn(String usedYn, Pageable pageable) {
        return null;
    }

    @Override
    public Page<PushContents> findAllByContentSeq(Long contentSeq, Pageable pageable) {
        return null;
    }


    @Override
    public Long countByContentSeqAndPushYn(Long contentSeq, String pushYn) {
        return null;
    }
}
