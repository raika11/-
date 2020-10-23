package jmnet.moka.core.tps.mvc.member.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.member.dto.GroupSearchDTO;
import jmnet.moka.core.tps.mvc.member.entity.Group;
import jmnet.moka.core.tps.mvc.member.entity.QGroup;
import jmnet.moka.core.tps.mvc.member.entity.QMember;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.member.repository
 * ClassName : GroupRepositorySupportImpl
 * Created : 2020-10-22 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-22 18:56
 */
public class GroupRepositorySupportImpl extends QuerydslRepositorySupport implements GroupRepositorySupport {

    private final JPAQueryFactory queryFactory;

    public GroupRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(Group.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<Group> findAllGroup(GroupSearchDTO searchDTO) {
        QGroup qGroup = QGroup.group;
        QMember qMember = QMember.member;

        JPQLQuery<Group> query = from(qGroup);
        if (McpString.isNotEmpty(searchDTO.getGroupCd())) {
            query.where(qGroup.groupCd
                    .toUpperCase()
                    .contains(searchDTO
                            .getGroupCd()
                            .toUpperCase()));
        }
        if (McpString.isNotEmpty(searchDTO.getGroupNm())) {
            query.where(qGroup.groupNm
                    .toUpperCase()
                    .contains(searchDTO
                            .getGroupNm()
                            .toUpperCase()));
        }
        Pageable pageable = searchDTO.getPageable();
        if (McpString.isYes(searchDTO.getUseTotal())) {
            query = getQuerydsl().applyPagination(pageable, query);
        }

        QueryResults<Group> list = query
                .leftJoin(qGroup.regUser, qMember)
                .fetchJoin()
                .fetchResults();

        return new PageImpl<Group>(list.getResults(), pageable, list.getTotal());
    }
}
