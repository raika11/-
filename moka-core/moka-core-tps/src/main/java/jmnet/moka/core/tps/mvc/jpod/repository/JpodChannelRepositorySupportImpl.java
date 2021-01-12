package jmnet.moka.core.tps.mvc.jpod.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.jpod.dto.JpodChannelSearchDTO;
import jmnet.moka.core.tps.mvc.jpod.entity.JpodChannel;
import jmnet.moka.core.tps.mvc.jpod.entity.QJpodChannel;
import jmnet.moka.core.tps.mvc.jpod.entity.QJpodKeyword;
import jmnet.moka.core.tps.mvc.jpod.entity.QJpodMember;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.jpod.repository
 * ClassName : JpodChannelRepositorySupportImpl
 * Created : 2020-11-09 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-09 13:48
 */
public class JpodChannelRepositorySupportImpl extends TpsQueryDslRepositorySupport implements JpodChannelRepositorySupport {

    public JpodChannelRepositorySupportImpl(JPAQueryFactory queryFactory) {

        super(JpodChannel.class);
    }

    @Override
    public Page<JpodChannel> findAllJpodChannel(JpodChannelSearchDTO search) {
        QJpodChannel qJpodChannel = QJpodChannel.jpodChannel;


        JPQLQuery<JpodChannel> query = from(qJpodChannel);

        if (McpString.isNotEmpty(search.getKeyword())) {
            query.where(qJpodChannel.chnlNm.contains(search.getKeyword()));
        }
        if (McpString.isNotEmpty(search.getUsedYn())) {
            query.where(qJpodChannel.usedYn.eq(search.getUsedYn()));
        }
        if (search.getStartDt() != null && search.getEndDt() != null) {
            query.where(qJpodChannel.regDt.between(search.getStartDt(), search.getEndDt()));
        } else if (search.getStartDt() != null) {
            query.where(qJpodChannel.regDt.goe(search.getStartDt()));
        } else if (search.getEndDt() != null) {
            query.where(qJpodChannel.regDt.loe(search.getEndDt()));
        } else {
            // 아무것도 안함
        }

        if (McpString.isYes(search.getUseTotal())) {
            query = getQuerydsl().applyPagination(search.getPageable(), query);
        }


        QueryResults<JpodChannel> list = query.fetchResults();

        return new PageImpl<JpodChannel>(list.getResults(), search.getPageable(), list.getTotal());
    }

    @Override
    public long deleteKeywordByChnlSeq(Long chnlSeq) {
        QJpodKeyword qJpodKeyword = QJpodKeyword.jpodKeyword;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qJpodKeyword.chnlSeq
                .eq(chnlSeq)
                .and(qJpodKeyword.epsdSeq.eq(0L)));
        return delete(qJpodKeyword)
                .where(builder)
                .execute();
    }


    @Override
    public long deleteMemberByChnlSeq(Long chnlSeq) {
        QJpodMember qJpodMember = QJpodMember.jpodMember;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qJpodMember.chnlSeq
                .eq(chnlSeq)
                .and(qJpodMember.epsdSeq.eq(0L)));
        return delete(qJpodMember)
                .where(builder)
                .execute();
    }
}
