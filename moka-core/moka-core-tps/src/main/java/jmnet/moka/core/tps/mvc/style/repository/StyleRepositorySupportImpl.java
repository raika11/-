/**
 * msp-tps StyleRepositorySupportImpl.java 2020. 4. 29. 오후 3:03:44 ssc
 */
package jmnet.moka.core.tps.mvc.style.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.style.dto.StyleSearchDTO;
import jmnet.moka.core.tps.mvc.style.entity.QStyle;
import jmnet.moka.core.tps.mvc.style.entity.Style;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * <pre>
 *
 * 2020. 4. 29. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 4. 29. 오후 3:03:44
 */
public class StyleRepositorySupportImpl extends QuerydslRepositorySupport implements StyleRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public StyleRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(Style.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<Style> findList(StyleSearchDTO search, Pageable pageable) {
        QStyle style = QStyle.style;

        BooleanBuilder builder = new BooleanBuilder();
        String searchType = search.getSearchType();
        String keyword = search.getKeyword();

        // WHERE 조건
        if (!McpString.isEmpty(searchType) && !McpString.isEmpty(keyword)) {
            if (searchType.equals("styleSeq")) {
                builder.and(style.styleSeq.eq(Long.parseLong(keyword)));
            } else if (searchType.equals("styleName")) {
                builder.and(style.styleName.contains(keyword));
            } else if (searchType.equals(TpsConstants.SEARCH_TYPE_ALL)) {
                builder.and(style.styleSeq.like(keyword)
                                          .or(style.styleName.contains(keyword)));
            }
        }

        JPQLQuery<Style> query = queryFactory.selectFrom(style);
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<Style> list = query.where(builder)
                                        .fetchResults();

        return new PageImpl<Style>(list.getResults(), pageable, list.getTotal());
    }

}
