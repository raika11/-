package jmnet.moka.core.tps.mvc.member.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.Optional;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.member.dto.MemberSearchDTO;
import jmnet.moka.core.tps.mvc.member.entity.MemberInfo;
import jmnet.moka.core.tps.mvc.member.entity.QMemberInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.member.repository
 * ClassName : MemberRepositorySupportImpl
 * Created : 2020-11-02 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-02 18:49
 */
public class MemberRepositorySupportImpl extends QuerydslRepositorySupport implements MemberRepositorySupport {
    private final JPAQueryFactory queryFactory;

    public MemberRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(MemberInfo.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<MemberInfo> findAllMember(MemberSearchDTO memberSearchDTO) {
        QMemberInfo qMember = QMemberInfo.memberInfo;
        QMemberInfo qRegMember = new QMemberInfo("regMember");

        JPQLQuery<MemberInfo> query = from(qMember);

        if (McpString.isNotEmpty(memberSearchDTO.getMemberId())) {
            query.where(qMember.memberId.eq(memberSearchDTO.getMemberId()));
        }
        if (McpString.isNotEmpty(memberSearchDTO.getMemberNm())) {
            query.where(qMember.memberNm.contains(memberSearchDTO.getMemberNm()));
        }


        QueryResults<MemberInfo> list = query
                .leftJoin(qMember.regMember, qRegMember)
                .fetchJoin()
                .fetchResults();

        return new PageImpl<MemberInfo>(list.getResults(), memberSearchDTO.getPageable(), list.getTotal());
    }

    @Override
    public Optional<MemberInfo> findByMemberId(String memberId) {
        QMemberInfo qMember = QMemberInfo.memberInfo;
        QMemberInfo qRegMember = new QMemberInfo("regMember");

        JPQLQuery<MemberInfo> query = from(qMember);

        query.where(qMember.memberId.eq(memberId));

        MemberInfo member = query
                .leftJoin(qMember.regMember, qRegMember)
                .fetchJoin()
                .fetchFirst();

        return Optional.ofNullable(member);
    }
}
