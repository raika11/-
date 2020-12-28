package jmnet.moka.core.tps.mvc.dataset.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.dataset.dto.DatasetSearchDTO;
import jmnet.moka.core.tps.mvc.dataset.entity.Dataset;
import jmnet.moka.core.tps.mvc.dataset.entity.QDataset;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

public class DatasetRepositorySupportImpl extends TpsQueryDslRepositorySupport implements DatasetRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public DatasetRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(Dataset.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<Dataset> findList(DatasetSearchDTO search, Pageable pageable) {
        QDataset dataset = QDataset.dataset;

        BooleanBuilder builder = new BooleanBuilder();
        String searchType = search.getSearchType();
        String keyword = search.getKeyword();

        // WHERE 조건
        builder.and(dataset.dataApiHost.eq(search.getApiHost()));
        builder.and(dataset.dataApiPath.eq(search.getApiPath()));

        if (!McpString.isEmpty(searchType) && !McpString.isEmpty(keyword)) {
            if (searchType.equals("datasetSeq")) {
                builder.and(dataset.datasetSeq.eq(Long.parseLong(keyword)));
            } else if (searchType.equals("datasetName")) {
                builder.and(dataset.datasetName.contains(keyword));
            } else if (searchType.equals(TpsConstants.SEARCH_TYPE_ALL)) {
                builder.and(dataset.datasetSeq
                        .like(keyword)
                        .or(dataset.datasetName.contains(keyword)));
            }
        }

        JPQLQuery<Dataset> query = queryFactory
                .selectFrom(dataset)
                .where(builder);
        query = getQuerydsl().applyPagination(pageable, query);
        QueryResults<Dataset> list = query.fetchResults();

        return new PageImpl<Dataset>(list.getResults(), pageable, list.getTotal());
    }
}
