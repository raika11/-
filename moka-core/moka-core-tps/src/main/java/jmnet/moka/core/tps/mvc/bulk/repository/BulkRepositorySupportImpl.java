package jmnet.moka.core.tps.mvc.bulk.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.bulk.dto.BulkSearchDTO;
import jmnet.moka.core.tps.mvc.bulk.entity.Bulk;
import jmnet.moka.core.tps.mvc.bulk.entity.QBulk;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.transaction.annotation.Transactional;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.naverbulk.repository
 * ClassName : BulkRepositorySupportImpl
 * Created : 2020-10-22 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-22 18:56
 */
public class BulkRepositorySupportImpl extends QuerydslRepositorySupport implements BulkRepositorySupport {


    public BulkRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(Bulk.class);

    }

    @Override
    public Page<Bulk> findAllBulkList(BulkSearchDTO searchDTO) {
        QBulk qBulk = QBulk.bulk;
        JPQLQuery<Bulk> query = from(qBulk);

        //검색조건 : 클릭기사 그룹
        if (McpString.isNotEmpty(searchDTO.getBulkartDiv())) {
            query.where(qBulk.bulkartDiv
                    .toUpperCase()
                    .eq(searchDTO
                            .getBulkartDiv()
                            .toUpperCase()));
        }

        //검색조건 : 출처
        if (McpString.isNotEmpty(searchDTO.getSourceCode())) {
            query.where(qBulk.sourceCode
                    .toUpperCase()
                    .eq(searchDTO
                            .getSourceCode()
                            .toUpperCase()));
        }

        //검색조건 : 서비스여부
        if (McpString.isNotEmpty(searchDTO.getUsedYn())) {
            query.where(qBulk.usedYn
                    .toUpperCase()
                    .eq(searchDTO
                            .getUsedYn()
                            .toUpperCase()));
        }

        if (McpString.isNotEmpty(searchDTO.getStatus())) {
            query.where(qBulk.status.eq(searchDTO.getStatus()));
        }

        //검색조건 : 조회시작일자
        if (searchDTO.getStartDt() != null) {
            //query.where(qBulk.regDt.between(McpDate.dateStr(searchDTO.getStartDt()), McpDate.dateStr(searchDTO.getEndDt())));
            query.where(qBulk.regDt.between(searchDTO.getStartDt(), searchDTO.getEndDt()));
        }

        //검색조건 : 조회종료일자
        Pageable pageable = searchDTO.getPageable();
        if (McpString.isYes(searchDTO.getUseTotal())) {
            query = getQuerydsl().applyPagination(pageable, query);
        }

        QueryResults<Bulk> list = query.fetchResults();
        return new PageImpl<Bulk>(list.getResults(), pageable, list.getTotal());
    }

    @Override
    @Transactional
    public void updateArticle(Bulk bulk) {
        // 기존 로직 데이터 서비스여부 N처리
        QBulk qBulk = QBulk.bulk;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qBulk.bulkartDiv.eq(bulk.getBulkartDiv()));
        builder.and(qBulk.sourceCode.eq(bulk.getSourceCode()));
        update(qBulk)
                .where(builder)
                .set(qBulk.usedYn, MokaConstants.NO)
                .execute();

        // 신규로 받은 데이터 서비스여부 Y처리
        BooleanBuilder builder1 = new BooleanBuilder();
        builder1.and(qBulk.bulkartSeq.eq(bulk.getBulkartSeq()));
        update(qBulk)
                .where(builder1)
                .set(qBulk.usedYn, MokaConstants.YES)
                .execute();

    }
}
