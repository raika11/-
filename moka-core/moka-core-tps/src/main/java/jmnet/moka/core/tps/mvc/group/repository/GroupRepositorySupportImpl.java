package jmnet.moka.core.tps.mvc.group.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.group.dto.GroupSearchDTO;
import jmnet.moka.core.tps.mvc.group.entity.GroupInfo;
import jmnet.moka.core.tps.mvc.group.entity.QGroupInfo;
import jmnet.moka.core.tps.mvc.member.entity.QMemberInfo;
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
        super(GroupInfo.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<GroupInfo> findAllGroup(GroupSearchDTO searchDTO) {
        QGroupInfo qGroup = QGroupInfo.groupInfo;
        QMemberInfo qMember = QMemberInfo.memberInfo;

        JPQLQuery<GroupInfo> query = from(qGroup);
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

        QueryResults<GroupInfo> list = query
                .leftJoin(qGroup.regMember, qMember)
                .fetchJoin()
                .fetchResults();

        return new PageImpl<GroupInfo>(list.getResults(), pageable, list.getTotal());
    }
}
