package jmnet.moka.core.tps.mvc.jpod.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.jpod.dto.JpodEpisodeSearchDTO;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodEpisode;
import jmnet.moka.core.tps.mvc.jpod.entity.QJpodChannel;
import jmnet.moka.core.tps.mvc.jpod.entity.QJpodEpisode;
import jmnet.moka.core.tps.mvc.jpod.entity.QJpodEpisodeRelArt;
import jmnet.moka.core.tps.mvc.jpod.entity.QJpodKeyword;
import jmnet.moka.core.tps.mvc.jpod.entity.QJpodMember;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.transaction.annotation.Transactional;

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
public class JpodEpisodeRepositorySupportImpl extends TpsQueryDslRepositorySupport implements JpodEpisodeRepositorySupport {


    public JpodEpisodeRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(JpodEpisode.class);
    }

    @Override
    public Page<JpodEpisode> findAllJpodEpisode(JpodEpisodeSearchDTO search) {
        QJpodEpisode qJpodEpisode = QJpodEpisode.jpodEpisode;
        QJpodChannel jpodChannel = QJpodChannel.jpodChannel;

        JPQLQuery<JpodEpisode> query = from(qJpodEpisode);
        // 채널번호
        if (search.getChnlSeq() != null && search.getChnlSeq() > 0) {
            query.where(qJpodEpisode.chnlSeq.eq(search.getChnlSeq()));
        }
        // 팟티 채널번호
        if (search.getPodtyChnlSrl() != null && search.getPodtyChnlSrl() > 0) {
            query.where(qJpodEpisode.chnlSeq.in(JPAExpressions
                    .selectFrom(jpodChannel)
                    .select(jpodChannel.chnlSeq)
                    .where(jpodChannel.podtyChnlSrl.eq(search.getPodtyChnlSrl()))));
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

    @Override
    @Transactional
    public long updateUsedYn(Long epsdSeq, String usedYn) {
        QJpodEpisode qJpodEpisode = QJpodEpisode.jpodEpisode;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qJpodEpisode.epsdSeq.eq(epsdSeq));
        return update(qJpodEpisode)
                .where(builder)
                .set(qJpodEpisode.usedYn, usedYn)
                .execute();
    }


    @Transactional
    public long deleteKeywordByEpsdSeq(Long epsdSeq) {
        QJpodKeyword qJpodKeyword = QJpodKeyword.jpodKeyword;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qJpodKeyword.epsdSeq.eq(epsdSeq));
        return delete(qJpodKeyword)
                .where(builder)
                .execute();
    }

    @Transactional
    public long deleteArticleByEpsdSeq(Long epsdSeq) {
        QJpodEpisodeRelArt qJpodEpisodeRelArt = QJpodEpisodeRelArt.jpodEpisodeRelArt;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qJpodEpisodeRelArt.id.epsdSeq.eq(epsdSeq));
        return delete(qJpodEpisodeRelArt)
                .where(builder)
                .execute();
    }

    @Transactional
    public long deleteMemberByEpsdSeq(Long epsdSeq) {
        QJpodMember qJpodMember = QJpodMember.jpodMember;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qJpodMember.epsdSeq.eq(epsdSeq));
        return delete(qJpodMember)
                .where(builder)
                .execute();
    }
}
