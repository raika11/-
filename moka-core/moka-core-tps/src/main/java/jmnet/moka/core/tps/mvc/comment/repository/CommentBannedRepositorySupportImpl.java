package jmnet.moka.core.tps.mvc.comment.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.Optional;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.mvc.codemgt.entity.QCodeMgt;
import jmnet.moka.core.tps.mvc.comment.dto.CommentBannedSearchDTO;
import jmnet.moka.core.tps.mvc.comment.entity.CommentBanned;
import jmnet.moka.core.tps.mvc.comment.entity.QCommentBanned;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

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
public class CommentBannedRepositorySupportImpl extends QuerydslRepositorySupport implements CommentBannedRepositorySupport {

    public CommentBannedRepositorySupportImpl(JPAQueryFactory queryFactory) {
        super(CommentBanned.class);
    }

    @EntityGraph(attributePaths = {"codeMgt"}, type = EntityGraph.EntityGraphType.LOAD)
    public Page<CommentBanned> findAllCommentBanned(CommentBannedSearchDTO searchDTO) {
        Pageable pageable = searchDTO.getPageable();
        QCommentBanned qCommentBanned = QCommentBanned.commentBanned;
        QCodeMgt qCodeMgt = QCodeMgt.codeMgt;
        JPQLQuery<CommentBanned> query = from(qCommentBanned);

        if (McpString.isNotEmpty(searchDTO.getTagDiv())) {
            query.where(qCommentBanned.tagDiv.eq(searchDTO.getTagDiv()));
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

        if (McpString.isYes(searchDTO.getUseTotal())) {
            query = getQuerydsl().applyPagination(pageable, query);
        }

        query.where(qCommentBanned.tagDivCode.codeMgtGrp.grpCd.eq("CMT_TAG_DIV"));

        QueryResults<CommentBanned> list = query
                .leftJoin(qCommentBanned.tagDivCode)
                .fetchJoin()
                .fetchResults();

        return new PageImpl<CommentBanned>(list.getResults(), pageable, list.getTotal());
    }


    @EntityGraph(attributePaths = {"codeMgt"}, type = EntityGraph.EntityGraphType.LOAD)
    public Optional<CommentBanned> findCommentBanned(Long seqNo) {

        QCommentBanned qCommentBanned = QCommentBanned.commentBanned;
        QCodeMgt qCodeMgt = QCodeMgt.codeMgt;
        JPQLQuery<CommentBanned> query = from(qCommentBanned);

        query.where(qCommentBanned.seqNo.eq(seqNo));
        query.where(qCommentBanned.tagDivCode.codeMgtGrp.grpCd.eq(TpsConstants.CMT_TAG_DIV));

        CommentBanned commentBanned = query
                .leftJoin(qCommentBanned.tagDivCode)
                .fetchJoin()
                .fetchFirst();

        return Optional.ofNullable(commentBanned);
    }
}
