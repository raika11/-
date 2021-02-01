package jmnet.moka.core.tps.mvc.watermark.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.watermark.dto.WatermarkSearchDTO;
import jmnet.moka.core.tps.mvc.watermark.entity.Watermark;
import jmnet.moka.core.tps.mvc.watermark.entity.QWatermark;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.member.repository
 * ClassName : WatermarkRepositorySupportImpl
 * Created : 2020-10-22 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-22 18:56
 */
public class WatermarkRepositorySupportImpl extends TpsQueryDslRepositorySupport implements WatermarkRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public WatermarkRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(Watermark.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<Watermark> findAllWatermark(WatermarkSearchDTO searchDTO) {
        QWatermark qWatermark = QWatermark.watermark;


        JPQLQuery<Watermark> query = from(qWatermark);
        // 사용여부
        if (McpString.isNotEmpty(searchDTO.getUsedYn())) {
            query.where(qWatermark.usedYn
                    .toUpperCase()
                    .eq(searchDTO
                            .getUsedYn()
                            .toUpperCase()));
        }

        //전체 : all, 제목 : title, 내용:content, 키워드 : keyword
        String searchType = searchDTO.getSearchType();
        String keyword = searchDTO.getKeyword();

        // WHERE 조건
        if (!McpString.isEmpty(searchType) && !McpString.isEmpty(keyword)) {
            if (searchType.equals("title")) {
                query.where(qWatermark.title.contains(keyword));
            } else if (searchType.equals(TpsConstants.SEARCH_TYPE_ALL)) {
                query.where(qWatermark.title.contains(keyword));
            }
        }

        Pageable pageable = searchDTO.getPageable();
        if (McpString.isYes(searchDTO.getUseTotal())) {
            query = getQuerydsl().applyPagination(pageable, query);
        }

        QueryResults<Watermark> list = query.fetchResults();

        return new PageImpl<Watermark>(list.getResults(), pageable, list.getTotal());
    }

}
