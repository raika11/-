package jmnet.moka.core.tps.mvc.articlePackage.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.articlePackage.dto.ArticlePackageSearchDTO;
import jmnet.moka.core.tps.mvc.articlePackage.entity.ArticlePackage;
import jmnet.moka.core.tps.mvc.articlePackage.entity.QArticlePackage;
import jmnet.moka.core.tps.mvc.newsletter.entity.QNewsletterInfoSimple;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.articlePackage.repository
 * ClassName : ArticlePackageRepositorySupportImpl
 * Created : 2021-05-04 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-05-04 오전 9:45
 */
public class ArticlePackageRepositorySupportImpl extends TpsQueryDslRepositorySupport implements ArticlePackageRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public ArticlePackageRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(ArticlePackage.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<ArticlePackage> findAllArticlePackage(ArticlePackageSearchDTO searchDTO) {
        QArticlePackage qArticlePackage = QArticlePackage.articlePackage;
        QNewsletterInfoSimple qNewsletterInfo = QNewsletterInfoSimple.newsletterInfoSimple;

        JPQLQuery<ArticlePackage> query = from(qArticlePackage).distinct();
        Pageable pageable = searchDTO.getPageable();

        if (McpString.isNotEmpty(searchDTO.getPkgDiv())) {
            // 구분
            query.where(qArticlePackage.pkgDiv
                    .toUpperCase()
                    .eq(searchDTO.getPkgDiv()));
        }
        if (McpString.isNotEmpty(searchDTO.getScbYn())) {
            // 구독가능 여부
            query.where(qArticlePackage.scbYn
                    .toUpperCase()
                    .eq(searchDTO.getScbYn()));
        }
        if ("S".equalsIgnoreCase(searchDTO.getSearchDtType())) {
            // 등록일 기준
            if (searchDTO.getStartDt() != null) {
                // 검색 시작일
                query.where(qArticlePackage.regDt.after(searchDTO.getStartDt()));
            }
            if (searchDTO.getEndDt() != null) {
                // 검색 종료일
                query.where(qArticlePackage.regDt.before(searchDTO.getEndDt()));
            }
        } else {
            // 종료일 기준
            if (searchDTO.getStartDt() != null) {
                // 검색 시작일
                query.where(qArticlePackage.endDt.after(searchDTO.getStartDt()));
            }
            if (searchDTO.getEndDt() != null) {
                // 검색 종료일
                query.where(qArticlePackage.endDt.before(searchDTO.getEndDt()));
            }
        }
        if (McpString.isNotEmpty(searchDTO.getKeyword())) {
            // 검색어
            query.where(qArticlePackage.pkgTitle
                    .toUpperCase()
                    .contains(searchDTO.getKeyword()));
        }
        if (McpString.isYes(searchDTO.getUseTotal())) {
            query = getQuerydsl().applyPagination(pageable, query);
        }

        QueryResults<ArticlePackage> list = query
                .leftJoin(qArticlePackage.newsletterInfo, qNewsletterInfo)
                .fetchJoin()
                .where(qNewsletterInfo.channelType
                        .containsIgnoreCase("ARTPKG")
                        .or(qNewsletterInfo.channelType.isNull()))
                .fetchResults();

        return new PageImpl<ArticlePackage>(list.getResults(), pageable, list.getTotal());
    }
}
