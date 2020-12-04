package jmnet.moka.core.tps.mvc.jpod.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.jpod.dto.JpodEpisodeSearchDTO;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodEpisode;
import jmnet.moka.core.tps.mvc.jpod.entity.QJpodEpisode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.jpod.repository
 * ClassName : JpodEpisodeRepositorySupportImpl
 * Created : 2020-11-09 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-09 17:16
 */
public class JpodEpisodeRepositorySupportImpl extends QuerydslRepositorySupport implements JpodEpisodeRepositorySupport {


    public JpodEpisodeRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(JpodEpisode.class);
    }

    @Override
    public Page<JpodEpisode> findAllJpodEpisode(JpodEpisodeSearchDTO search) {
        QJpodEpisode qJpodEpisode = QJpodEpisode.jpodEpisode;


        JPQLQuery<JpodEpisode> query = from(qJpodEpisode);
        // 채널명
        if (search.getChnlSeq() > 0) {
            query.where(qJpodEpisode.chnlSeq.eq(search.getChnlSeq()));
        }
        // 에피소드명
        if (McpString.isNotEmpty(search.getKeyword())) {
            query.where(qJpodEpisode.epsdNm.contains(search.getKeyword()));
        }
        // 사용여부
        if (McpString.isNotEmpty(search.getUsedYn())) {
            query.where(qJpodEpisode.usedYn.eq(search.getUsedYn()));
        }
        // 방송일
        if (search.getStartDt() != null && search.getEndDt() != null) {
            query.where(qJpodEpisode.epsdDate.between(McpDate.dateStr(search.getStartDt()), McpDate.dateStr(search.getEndDt())));
        } else if (search.getStartDt() != null) {
            query.where(qJpodEpisode.epsdDate.goe(McpDate.dateStr(search.getStartDt())));
        } else if (search.getEndDt() != null) {
            query.where(qJpodEpisode.epsdDate.loe(McpDate.dateStr(search.getEndDt())));
        } else {
            // 아무것도 안함
        }

        if (McpString.isYes(search.getUseTotal())) {
            query = getQuerydsl().applyPagination(search.getPageable(), query);
        }


        QueryResults<JpodEpisode> list = query.fetchResults();

        return new PageImpl<JpodEpisode>(list.getResults(), search.getPageable(), list.getTotal());
    }
}
