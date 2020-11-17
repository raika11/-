package jmnet.moka.core.tps.mvc.directlink.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.directlink.dto.DirectLinkSearchDTO;
import jmnet.moka.core.tps.mvc.directlink.entity.DirectLink;
import jmnet.moka.core.tps.mvc.directlink.entity.QDirectLink;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.member.repository
 * ClassName : DirectLinkRepositorySupportImpl
 * Created : 2020-10-22 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-22 18:56
 */
public class DirectLinkRepositorySupportImpl extends QuerydslRepositorySupport implements DirectLinkRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public DirectLinkRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(DirectLink.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<DirectLink> findAllDirectLink(DirectLinkSearchDTO searchDTO) {
        QDirectLink qDirectLink = QDirectLink.directLink;


        JPQLQuery<DirectLink> query = from(qDirectLink);
        // 사용여부
        if (McpString.isNotEmpty(searchDTO.getUsedYn())) {
            query.where(qDirectLink.usedYn.toUpperCase().eq(searchDTO.getUsedYn().toUpperCase()));
        }

        // 노출여부
        if (McpString.isNotEmpty(searchDTO.getFixYn())) {
            query.where(qDirectLink.fixYn.toUpperCase().eq(searchDTO.getFixYn().toUpperCase()));
        }

        // 유형
        if (McpString.isNotEmpty(searchDTO.getLinkType())) {
            query.where(qDirectLink.linkType.toUpperCase().eq(searchDTO.getLinkType().toUpperCase()));
        }

        // 키워드
        if (McpString.isNotEmpty(searchDTO.getLinkKwd())) {
            query.where(qDirectLink.linkKwd.contains(searchDTO.getLinkKwd()));
        }


        Pageable pageable = searchDTO.getPageable();
        if (McpString.isYes(searchDTO.getUseTotal())) {
            query = getQuerydsl().applyPagination(pageable, query);
        }

        QueryResults<DirectLink> list = query.fetchResults();

        return new PageImpl<DirectLink>(list.getResults(), pageable, list.getTotal());
    }

}
