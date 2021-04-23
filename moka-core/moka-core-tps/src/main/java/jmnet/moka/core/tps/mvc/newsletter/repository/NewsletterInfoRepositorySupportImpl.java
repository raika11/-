package jmnet.moka.core.tps.mvc.newsletter.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.member.entity.QMemberSimpleInfo;
import jmnet.moka.core.tps.mvc.newsletter.dto.NewsletterSearchDTO;
import jmnet.moka.core.tps.mvc.newsletter.entity.NewsletterInfo;
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
 * ClassName : NewsletterInfoRepositorySupportImpl
 * Created : 2021-04-16 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-16 오후 5:36
 */
public class NewsletterInfoRepositorySupportImpl extends TpsQueryDslRepositorySupport implements NewsletterInfoRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public NewsletterInfoRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(NewsletterInfo.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<NewsletterInfo> findAllNewsletterInfo(NewsletterSearchDTO searchDTO) {
        QNewsletterInfo qNewsletterInfo = QNewsletterInfo.newsletterInfo;
        //        QNewsletterSubscribe qNewsletterSubscribe = QNewsletterSubscribe.newsletterSubscribe;
        //        QNewsletterLog qNewsletterLog = QNewsletterLog.newsletterLog;
        QMemberSimpleInfo qMemberSimpleInfo = QMemberSimpleInfo.memberSimpleInfo;
        QNewsletterSend qNewsletterSend = QNewsletterSend.newsletterSend;

        JPQLQuery<NewsletterInfo> query = from(qNewsletterInfo).distinct();
        Pageable pageable = searchDTO.getPageable();

        if (McpString.isNotEmpty(searchDTO.getLetterType())) {
            // 유형
            query.where(qNewsletterInfo.letterType
                    .toUpperCase()
                    .eq(searchDTO.getLetterType()));
        }
        if (McpString.isNotEmpty(searchDTO.getStatus())) {
            // 상태
            query.where(qNewsletterInfo.status
                    .toUpperCase()
                    .eq(searchDTO.getStatus()));
        }
        if (McpString.isNotEmpty(searchDTO.getSendType())) {
            // 발송방법
            query.where(qNewsletterInfo.sendType
                    .toUpperCase()
                    .eq(searchDTO.getSendType()));
        }
        if (McpString.isNotEmpty(searchDTO.getAbtestYn())) {
            // A/B TEST 유무
            query.where(qNewsletterInfo.abtestYn
                    .toUpperCase()
                    .eq(searchDTO.getAbtestYn()));
        }
        if (searchDTO.getStartDt() != null) {
            // 검색 시작일
            query.where(qNewsletterInfo.regDt.after(searchDTO.getStartDt()));
        }
        if (searchDTO.getEndDt() != null) {
            // 검색 종료일
            query.where(qNewsletterInfo.regDt.before(searchDTO.getEndDt()));
        }
        if (McpString.isNotEmpty(searchDTO.getLetterName())) {
            // 뉴스레터명
            query.where(qNewsletterInfo.letterName.contains(searchDTO.getLetterName()));
        }
        if (McpString.isYes(searchDTO.getUseTotal())) {
            query = getQuerydsl().applyPagination(pageable, query);

            //            query
            //                    .orderBy(new CaseBuilder()
            //                            .when(qNewsletterInfo.letterType.eq("O"))
            //                            .then("오리지널")
            //                            .when(qNewsletterInfo.letterType.eq("B"))
            //                            .then("브리핑")
            //                            .when(qNewsletterInfo.letterType.eq("N"))
            //                            .then("알림")
            //                            .otherwise("기타")
            //                            .asc())
            //                    .offset(pageable.getOffset())
            //                    .limit(pageable.getPageSize());
            //            searchDTO
            //                    .getPageable()
            //                    .getSort()
            //                    .stream()
            //                    .forEach((order) -> {
            //                        System.out.println(order.getProperty() + "," + order.getDirection());
            //                    });
        }

        QueryResults<NewsletterInfo> list = query
                //                .leftJoin(qNewsletterInfo.newsletterSubscribes, qNewsletterSubscribe)
                //                .fetchJoin()
                //                .leftJoin(qNewsletterInfo.newsletterLogs, qNewsletterLog)
                //                .fetchJoin()
                .leftJoin(qNewsletterInfo.newsletterSends, qNewsletterSend)
                .fetchJoin()
                .leftJoin(qNewsletterInfo.regMember, qMemberSimpleInfo)
                .fetchJoin()
                .fetchResults();

        return new PageImpl<NewsletterInfo>(list.getResults(), pageable, list.getTotal());
    }

    @Override
    public List<Long> findAllChannelIdByChannelType(String ChannelType) {
        QNewsletterInfo qNewsletterInfo = QNewsletterInfo.newsletterInfo;
        QueryResults<Long> results = from(qNewsletterInfo)
                .select(qNewsletterInfo.channelId)
                .distinct()
                .where(qNewsletterInfo.channelType
                        .toUpperCase()
                        .eq(ChannelType))
                .fetchResults();
        return results.getResults();
    }
}
