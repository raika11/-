package jmnet.moka.core.tps.mvc.comment.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.Optional;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.codemgt.entity.QCodeSimple;
import jmnet.moka.core.tps.mvc.comment.code.CommentCode.CommentBannedType;
import jmnet.moka.core.tps.mvc.comment.dto.CommentBannedSearchDTO;
import jmnet.moka.core.tps.mvc.comment.entity.CommentBanned;
import jmnet.moka.core.tps.mvc.comment.entity.QCommentBanned;
import jmnet.moka.core.tps.mvc.member.entity.QMemberSimpleInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.comment.repository
 * ClassName : CommentMemberRepositorySupportImpl
 * Created : 2021-01-08 ince
 * </pre>
 *
 * @author ince
 * @since 2021-01-08 15:45
 */
public class CommentBannedRepositorySupportImpl extends TpsQueryDslRepositorySupport implements CommentBannedRepositorySupport {

    public CommentBannedRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(CommentBanned.class);
    }

    @EntityGraph(attributePaths = {"tagDivCode", "regMember"}, type = EntityGraph.EntityGraphType.LOAD)
    public Page<CommentBanned> findAllCommentBanned(CommentBannedSearchDTO searchDTO) {
        Pageable pageable = searchDTO.getPageable();
        QCommentBanned qCommentBanned = QCommentBanned.commentBanned;
        QMemberSimpleInfo qRegMember = new QMemberSimpleInfo("regMember");
        QCodeSimple qCodeSimple = QCodeSimple.codeSimple;
        JPQLQuery<CommentBanned> query = from(qCommentBanned);

        if (McpString.isNotEmpty(searchDTO.getTagDiv())) {
            query.where(qCommentBanned.tagDiv.eq(searchDTO.getTagDiv()));
        }
        if (McpString.isNotEmpty(searchDTO.getTagType())) {
            query.where(qCommentBanned.tagType.eq(searchDTO.getTagType()));
        }
        if (McpString.isNotEmpty(searchDTO.getKeyword())) {
            if (qCommentBanned.tagValue
                    .getMetadata()
                    .getName()
                    .equals(searchDTO.getSearchType())) {
                query.where(qCommentBanned.tagValue.contains(searchDTO.getKeyword()));
            } else {
                if (qCommentBanned.tagDesc
                        .getMetadata()
                        .getName()
                        .equals(searchDTO.getSearchType())) {
                    query.where(qCommentBanned.tagDesc.contains(searchDTO.getKeyword()));
                }
            }
        }

        if (McpString.isNotEmpty(searchDTO.getMedia())) {
            query.where(qCommentBanned.tagValue.endsWith(searchDTO.getMedia()));
        }

        if (McpString.isYes(searchDTO.getUseTotal())) {
            query = getQuerydsl().applyPagination(pageable, query);
        }

        query.where(qCommentBanned.tagDivCode.grpCd
                .eq(TpsConstants.CMT_TAG_DIV)
                .and(qCommentBanned.tagDivCode.usedYn.eq(MokaConstants.YES)));

        QueryResults<CommentBanned> list = query
                .leftJoin(qCommentBanned.regMember, qRegMember)
                .fetchJoin()
                .leftJoin(qCommentBanned.tagDivCode, qCodeSimple)
                .fetchJoin()
                .fetchResults();

        return new PageImpl<CommentBanned>(list.getResults(), pageable, list.getTotal());
    }

    @EntityGraph(attributePaths = {"tagDivCode", "regMember"}, type = EntityGraph.EntityGraphType.LOAD)
    public Optional<CommentBanned> findCommentBanned(CommentBannedType tagType, String tagValue) {

        QCommentBanned qCommentBanned = QCommentBanned.commentBanned;
        QCodeSimple qCodeSimple = QCodeSimple.codeSimple;
        QMemberSimpleInfo qRegMember = new QMemberSimpleInfo("regMember");
        JPQLQuery<CommentBanned> query = from(qCommentBanned);

        query.where(qCommentBanned.tagType
                .eq(tagType)
                .and(qCommentBanned.tagValue.eq(tagValue)));
        query.where(qCommentBanned.tagDivCode.grpCd
                .eq(TpsConstants.CMT_TAG_DIV)
                .and(qCommentBanned.tagDivCode.usedYn.eq(MokaConstants.YES)));

        CommentBanned commentBanned = query
                .leftJoin(qCommentBanned.tagDivCode, qCodeSimple)
                .fetchJoin()
                .leftJoin(qCommentBanned.regMember, qRegMember)
                .fetchJoin()
                .fetchFirst();

        return Optional.ofNullable(commentBanned);
    }


    @EntityGraph(attributePaths = {"tagDivCode", "regMember"}, type = EntityGraph.EntityGraphType.LOAD)
    public Optional<CommentBanned> findCommentBanned(Long seqNo) {

        QCommentBanned qCommentBanned = QCommentBanned.commentBanned;
        QCodeSimple qCodeSimple = QCodeSimple.codeSimple;
        QMemberSimpleInfo qRegMember = new QMemberSimpleInfo("regMember");
        JPQLQuery<CommentBanned> query = from(qCommentBanned);

        query.where(qCommentBanned.seqNo.eq(seqNo));
        query.where(qCommentBanned.tagDivCode.grpCd
                .eq(TpsConstants.CMT_TAG_DIV)
                .and(qCommentBanned.tagDivCode.usedYn.eq(MokaConstants.YES)));

        CommentBanned commentBanned = query
                .leftJoin(qCommentBanned.tagDivCode, qCodeSimple)
                .fetchJoin()
                .leftJoin(qCommentBanned.regMember, qRegMember)
                .fetchJoin()
                .fetchFirst();

        return Optional.ofNullable(commentBanned);
    }
}
