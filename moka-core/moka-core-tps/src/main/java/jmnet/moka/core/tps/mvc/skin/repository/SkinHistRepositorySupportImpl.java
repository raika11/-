package jmnet.moka.core.tps.mvc.skin.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.text.ParseException;
import java.util.Date;
import java.util.List;
import jmnet.moka.common.utils.McpDate;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.common.dto.HistSearchDTO;
import jmnet.moka.core.tps.mvc.domain.entity.QDomain;
import jmnet.moka.core.tps.mvc.skin.entity.QSkin;
import jmnet.moka.core.tps.mvc.skin.entity.QSkinHist;
import jmnet.moka.core.tps.mvc.skin.entity.SkinHist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

public class SkinHistRepositorySupportImpl extends QuerydslRepositorySupport implements SkinHistRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public SkinHistRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(SkinHist.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<SkinHist> findList(HistSearchDTO search, Pageable pageable) {
        QSkinHist skinHist = QSkinHist.skinHist;
        QDomain domain = QDomain.domain;
        QSkin skin = QSkin.skin;

        BooleanBuilder builder = new BooleanBuilder();
        String searchType = search.getSearchType();
        String keyword = search.getKeyword();

        // WHERE 조건
        builder.and(skinHist.skin.skinSeq.eq(search.getSeq()));
        if (!McpString.isEmpty(searchType) && !McpString.isEmpty(keyword)) {
            if (searchType.equals("regDt")) {
                try {
                    List<Date> keywordDtList = McpDate.betweenDate(MokaConstants.JSON_DATE_FORMAT, keyword);
                    builder.and(skinHist.regDt.between(Expressions.dateTemplate(Date.class, "{0}", keywordDtList.get(0)),
                                                       Expressions.dateTemplate(Date.class, "{0}", keywordDtList.get(1))));
                } catch (ParseException e) {
                }
            } else if (searchType.equals("regId")) {
                builder.and(skinHist.regId.contains(keyword));
            } else if (searchType.equals(TpsConstants.SEARCH_TYPE_ALL)) {
                List<Date> keywordDtList = null;
                try {
                    keywordDtList = McpDate.betweenDate(MokaConstants.JSON_DATE_FORMAT, keyword);
                } catch (ParseException e) {
                }
                builder.and(skinHist.regId.contains(keyword)
                                          .or(skinHist.regDt.between(Expressions.dateTemplate(Date.class, "{0}", keywordDtList.get(0)),
                                                                     Expressions.dateTemplate(Date.class, "{0}", keywordDtList.get(1)))));
            }
        }
        //        builder.and(skinHist.skin.skinSeq.eq(search.getSeq()));
        //        if (!McpString.isEmpty(searchType) && !McpString.isEmpty(keyword)) {
        //            if (searchType.equals("createYmdt")) {
        //                builder.and(skinHist.createYmdt.startsWith(keyword));
        //            } else if (searchType.equals("creator")) {
        //                builder.and(skinHist.creator.contains(keyword));
        //            } else if (searchType.equals(TpsConstants.SEARCH_TYPE_ALL)) {
        //                builder.and(skinHist.creator.contains(keyword)
        //                        .or(skinHist.createYmdt.startsWith(keyword)));
        //            }
        //        }

        JPQLQuery<SkinHist> query = queryFactory.selectFrom(skinHist);
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<SkinHist> list = query.innerJoin(skinHist.skin, skin)
                                           .fetchJoin()
                                           .innerJoin(skinHist.domain, domain)
                                           .fetchJoin()
                                           .where(builder)
                                           .fetchResults();

        return new PageImpl<SkinHist>(list.getResults(), pageable, list.getTotal());
    }
}
