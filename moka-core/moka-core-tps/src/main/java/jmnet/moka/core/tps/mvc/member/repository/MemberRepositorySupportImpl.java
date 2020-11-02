package jmnet.moka.core.tps.mvc.member.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.member.dto.MemberSearchDTO;
import jmnet.moka.core.tps.mvc.member.entity.Member;
import jmnet.moka.core.tps.mvc.member.entity.QMember;
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
        super(Member.class);
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<Member> findAllMember(MemberSearchDTO memberSearchDTO) {
        QMember qMember = QMember.member;

        JPQLQuery<Member> query = from(qMember);

        if (McpString.isNotEmpty(memberSearchDTO.getMemberId())) {
            query.where(qMember.memberId.eq(memberSearchDTO.getMemberId()));
        }
        if (McpString.isNotEmpty(memberSearchDTO.getMemberNm())) {
            query.where(qMember.memberNm.contains(memberSearchDTO.getMemberNm()));
        }


        QueryResults<Member> list = query
                .leftJoin(qMember.regMember, qMember)
                .fetchJoin()
                .fetchResults();

        return new PageImpl<Member>(list.getResults(), memberSearchDTO.getPageable(), list.getTotal());
    }
}
