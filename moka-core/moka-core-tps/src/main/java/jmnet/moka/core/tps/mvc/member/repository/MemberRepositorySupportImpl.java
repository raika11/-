package jmnet.moka.core.tps.mvc.member.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.JPQLQuery;
import java.util.Objects;
import java.util.Optional;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.group.entity.QGroupInfo;
import jmnet.moka.core.tps.mvc.group.entity.QGroupMember;
import jmnet.moka.core.tps.mvc.member.dto.MemberSearchDTO;
import jmnet.moka.core.tps.mvc.member.entity.MemberInfo;
import jmnet.moka.core.tps.mvc.member.entity.QMemberInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

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
public class MemberRepositorySupportImpl extends TpsQueryDslRepositorySupport implements MemberRepositorySupport {

    public MemberRepositorySupportImpl() {
        super(MemberInfo.class);
    }

    @Override
    public Page<MemberInfo> findAllMember(MemberSearchDTO memberSearchDTO) {
        QMemberInfo qMember = QMemberInfo.memberInfo;
        QMemberInfo qRegMember = new QMemberInfo("regMember");
        QGroupMember qGroupMember = QGroupMember.groupMember;
        QGroupInfo qGroupInfo = QGroupInfo.groupInfo;

        JPQLQuery<MemberInfo> query = from(qMember);
        if (McpString.isNotEmpty(memberSearchDTO.getKeyword())) {
            if (TpsConstants.SEARCH_TYPE_ALL.equals(memberSearchDTO.getSearchType())) {
                query.where(qMember.memberId
                        .contains(memberSearchDTO.getKeyword())
                        .or(qMember.memberNm.contains(memberSearchDTO.getKeyword())));
            } else {
                if (qMember.memberId
                        .getMetadata()
                        .getName()
                        .equals(memberSearchDTO.getSearchType())) {
                    query.where(qMember.memberId.contains(memberSearchDTO.getKeyword()));
                }
                if (qMember.memberNm
                        .getMetadata()
                        .getName()
                        .equals(memberSearchDTO.getSearchType())) {
                    query.where(qMember.memberNm.contains(memberSearchDTO.getKeyword()));
                }
            }
        }

        if (McpString.isNotEmpty(memberSearchDTO.getMemberId())) {
            query.where(qMember.memberId.eq(memberSearchDTO.getMemberId()));
        }
        if (McpString.isNotEmpty(memberSearchDTO.getMemberNm())) {
            query.where(qMember.memberNm.contains(memberSearchDTO.getMemberNm()));
        }

        if (McpString.isNotEmpty(memberSearchDTO.getGroupCd())) {
            query.where(qMember.memberId.contains(JPAExpressions
                    .select(qGroupMember.memberId)
                    .from(qGroupMember)
                    .where(qGroupMember.member.memberId
                            .eq(qMember.memberId)
                            .and(qGroupMember.groupCd.eq(memberSearchDTO.getGroupCd()))
                            .and(qGroupMember.usedYn.eq(MokaConstants.YES))
                            .and(qGroupMember.group.eq(JPAExpressions
                                    .selectFrom(qGroupInfo)
                                    .where(qGroupInfo.groupCd
                                            .eq(memberSearchDTO.getGroupCd())
                                            .and(qGroupInfo.usedYn.eq(MokaConstants.YES))))))));
        }

        if (memberSearchDTO.getStatus() != null) {
            query.where(qMember.status.eq(memberSearchDTO.getStatus()));
        }

        Pageable pageable = memberSearchDTO.getPageable();
        if (McpString.isYes(memberSearchDTO.getUseTotal())) {
            query = Objects
                    .requireNonNull(getQuerydsl())
                    .applyPagination(pageable, query);
        }


        QueryResults<MemberInfo> list = query
                .leftJoin(qMember.regMember, qRegMember)
                .fetchJoin()
                .fetchResults();

        return new PageImpl<>(list.getResults(), pageable, list.getTotal());
    }

    @Override
    public Optional<MemberInfo> findByMemberId(String memberId) {
        QMemberInfo qMember = QMemberInfo.memberInfo;
        QMemberInfo qRegMember = new QMemberInfo("regMember");
        QGroupMember qGroupMember = QGroupMember.groupMember;
        QGroupInfo qGroupInfo = QGroupInfo.groupInfo;
        JPQLQuery<MemberInfo> query = from(qMember);

        query.where(qMember.memberId.eq(memberId));
        
        MemberInfo member = query
                .leftJoin(qMember.regMember, qRegMember)
                .fetchJoin()
                .fetchFirst();

        return Optional.ofNullable(member);
    }
}
