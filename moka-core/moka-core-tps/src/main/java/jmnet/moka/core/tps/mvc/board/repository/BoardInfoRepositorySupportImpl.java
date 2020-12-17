package jmnet.moka.core.tps.mvc.board.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.board.dto.BoardInfoSearchDTO;
import jmnet.moka.core.tps.mvc.board.entity.BoardInfo;
import jmnet.moka.core.tps.mvc.board.entity.QBoardInfo;
import jmnet.moka.core.tps.mvc.member.entity.QMemberInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.board.repository
 * ClassName : BoardInfoRepositorySupportImpl
 * Created : 2020-12-17 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-17 11:56
 */
public class BoardInfoRepositorySupportImpl extends QuerydslRepositorySupport implements BoardInfoRepositorySupport {

    public BoardInfoRepositorySupportImpl() {
        super(BoardInfo.class);
    }

    public Page<BoardInfo> findAllBoardInfo(BoardInfoSearchDTO searchDTO) {
        QBoardInfo qBoardInfo = QBoardInfo.boardInfo;
        QMemberInfo qMember = QMemberInfo.memberInfo;

        JPQLQuery<BoardInfo> query = from(qBoardInfo);

        Pageable pageable = searchDTO.getPageable();
        if (McpString.isYes(searchDTO.getUseTotal())) {
            query = getQuerydsl().applyPagination(pageable, query);
        }

        QueryResults<BoardInfo> list = query.fetchResults();

        return new PageImpl<BoardInfo>(list.getResults(), pageable, list.getTotal());
    }
}
