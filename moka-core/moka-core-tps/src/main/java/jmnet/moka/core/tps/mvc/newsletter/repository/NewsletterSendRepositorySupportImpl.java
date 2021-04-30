package jmnet.moka.core.tps.mvc.newsletter.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.member.entity.QMemberSimpleInfo;
import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterSearchDTO;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterSend;
import jmnet.moka.core.tps.mvc.newsletter.entity.QNewsletterInfo;
import jmnet.moka.core.tps.mvc.newsletter.entity.QNewsletterSend;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.newsletter.repository
 * ClassName : NewsletterSendRepositorySupportImpl
 * Created : 2021-04-20 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-20 오후 3:14
 */
public class NewsletterSendRepositorySupportImpl extends TpsQueryDslRepositorySupport implements NewsletterSendRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public NewsletterSendRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(NewsletterSend.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<NewsletterSend> findAllNewsletterSend(NewsletterSearchDTO searchDTO) {
        QNewsletterInfo qNewsletterInfo = QNewsletterInfo.newsletterInfo;
        QNewsletterSend qNewsletterSend = QNewsletterSend.newsletterSend;
        QMemberSimpleInfo qMemberSimpleInfo = QMemberSimpleInfo.memberSimpleInfo;

        JPQLQuery<NewsletterSend> query = from(qNewsletterSend);
        Pageable pageable = searchDTO.getPageable();

        if (McpString.isNotEmpty(searchDTO.getLetterName())) {
            // 뉴스레터명
            query.where(qNewsletterInfo.letterName.contains(searchDTO.getLetterName()));
        }
        if (searchDTO.getStartDt() != null) {
            // 검색 시작일
            query.where(qNewsletterSend.sendDt.after(searchDTO.getStartDt()));
        }
        if (searchDTO.getEndDt() != null) {
            // 검색 종료일
            query.where(qNewsletterSend.sendDt.before(searchDTO.getEndDt()));
        }
        if (McpString.isYes(searchDTO.getUseTotal())) {
            query = getQuerydsl().applyPagination(pageable, query);
        }

        QueryResults<NewsletterSend> list = query
                .leftJoin(qNewsletterSend.newsletterInfo, qNewsletterInfo)
                .fetchJoin()
                .leftJoin(qNewsletterInfo.regMember, qMemberSimpleInfo)
                .fetchJoin()
                .fetchResults();

        return new PageImpl<NewsletterSend>(list.getResults(), pageable, list.getTotal());
    }
}
