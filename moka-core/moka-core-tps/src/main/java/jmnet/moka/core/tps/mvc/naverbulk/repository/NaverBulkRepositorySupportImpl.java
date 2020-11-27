package jmnet.moka.core.tps.mvc.naverbulk.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.mvc.naverbulk.dto.NaverBulkSearchDTO;
import jmnet.moka.core.tps.mvc.naverbulk.entity.Article;
import jmnet.moka.core.tps.mvc.naverbulk.entity.QArticle;
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
 * ClassName : NaverBulkRepositorySupportImpl
 * Created : 2020-10-22 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-22 18:56
 */
public class NaverBulkRepositorySupportImpl extends QuerydslRepositorySupport implements NaverBulkRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public NaverBulkRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(Article.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<Article> findAllNaverBulkList(NaverBulkSearchDTO searchDTO) {
        QArticle qArticle = QArticle.article;
        JPQLQuery<Article> query = from(qArticle);

        //검색조건 : 클릭기사 그룹
        if (McpString.isNotEmpty(searchDTO.getClickartDiv())) {
            query.where(qArticle.clickartDiv.toUpperCase().eq(searchDTO.getClickartDiv().toUpperCase()));
        }

        //검색조건 : 출처
        if (McpString.isNotEmpty(searchDTO.getSourceCode())) {
            query.where(qArticle.sourceCode.toUpperCase().eq(searchDTO.getSourceCode().toUpperCase()));
        }

        //검색조건 : 서비스여부
        if (McpString.isNotEmpty(searchDTO.getUsedYn())) {
            query.where(qArticle.usedYn.toUpperCase().eq(searchDTO.getUsedYn().toUpperCase()));
        }

        //검색조건 : 조회시작일자
        if (McpString.isNotEmpty(searchDTO.getStartDt())) {
            //query.where(qArticle.regDt.between(McpDate.dateStr(searchDTO.getStartDt()), McpDate.dateStr(searchDTO.getEndDt())));
            query.where(qArticle.regDt.between(searchDTO.getStartDt(), searchDTO.getEndDt()));
        }

        //검색조건 : 조회종료일자
        Pageable pageable = searchDTO.getPageable();
        if (McpString.isYes(searchDTO.getUseTotal())) {
            query = getQuerydsl().applyPagination(pageable, query);
        }

        QueryResults<Article> list = query.fetchResults();
        return new PageImpl<Article>(list.getResults(), pageable, list.getTotal());
    }

    @Override
    @Transactional
    public void updateArticle(Article article) {
        // 기존 로직 데이터 서비스여부 N처리
        QArticle qArticle = QArticle.article;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qArticle.clickartDiv.eq(article.getClickartDiv()));
        builder.and(qArticle.sourceCode.eq(article.getSourceCode()));
        queryFactory.update(qArticle).where(builder).set(qArticle.usedYn, MokaConstants.NO).execute();

        // 신규로 받은 데이터 서비스여부 Y처리
        BooleanBuilder builder1 = new BooleanBuilder();
        builder1.and(qArticle.clickartSeq.eq(article.getClickartSeq()));
        queryFactory.update(qArticle).where(builder1).set(qArticle.usedYn, MokaConstants.YES).execute();

    }
}
