package jmnet.moka.web.push.mvc.sender.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPQLQuery;
import java.util.List;
import jmnet.moka.web.push.mvc.sender.dto.PushAppTokenSearchDTO;
import jmnet.moka.web.push.mvc.sender.entity.PushAppToken;
import jmnet.moka.web.push.mvc.sender.entity.PushAppTokenStatus;
import jmnet.moka.web.push.mvc.sender.entity.QPushAppToken;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.web.push.mvc.sender.repository
 * ClassName : PushAppTokenRepositorySupportImpl
 * Created : 2021-03-16 ince
 * </pre>
 *
 * @author ince
 * @since 2021-03-16 19:44
 */
public class PushAppTokenRepositorySupportImpl extends QuerydslRepositorySupport implements PushAppTokenRepositorySupport {


    public PushAppTokenRepositorySupportImpl() {
        super(PushAppToken.class);
    }

    /**
     * 범위에 해당하는 토큰 목록 조회
     *
     * @param appSeq 검색조건
     * @return 작업
     */
    public List<PushAppToken> findAllByAppScope(Integer appSeq, long start, long limit) {
        QPushAppToken pushAppToken = QPushAppToken.pushAppToken;
        JPQLQuery<PushAppToken> query = from(pushAppToken);
        return query
                .where(pushAppToken.tokenSeq
                        .between(start, limit)
                        .and(pushAppToken.appSeq.eq(appSeq)))
                .fetch();
    }

    @Override
    public List<PushAppToken> findAllByAppScope(PushAppTokenSearchDTO pushAppTokenSearch) {
        QPushAppToken pushAppToken = QPushAppToken.pushAppToken;
        JPQLQuery<PushAppToken> query = from(pushAppToken);

        return query
                .where(pushAppToken.tokenSeq
                        .between(pushAppTokenSearch.getFirstTokenSeq(), pushAppTokenSearch.getLastTokenSeq())
                        .and(pushAppToken.appSeq.eq(pushAppTokenSearch.getAppSeq())))
                .offset(pushAppTokenSearch.getPage() * pushAppTokenSearch.getSize())
                .limit(pushAppTokenSearch.getSize())
                .orderBy(pushAppToken.tokenSeq.asc())
                .fetch();
    }


    @Override
    public PushAppTokenStatus countAllByAppScope(Integer appSeq) {
        QPushAppToken pushAppToken = QPushAppToken.pushAppToken;
        JPQLQuery<PushAppToken> query = from(pushAppToken);
        return query
                .select(Projections.fields(PushAppTokenStatus.class, pushAppToken.tokenSeq
                        .max()
                        .coalesce(0L)
                        .as("lastTokenSeq"), pushAppToken.tokenSeq
                        .min()
                        .coalesce(0L)
                        .as("firstTokenSeq"), pushAppToken.tokenSeq
                        .count()
                        .as("totalCount")))
                .from()
                .where(pushAppToken.appSeq.eq(appSeq))
                .fetchFirst();
    }
}
