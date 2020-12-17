package jmnet.moka.core.tps.mvc.board.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.mvc.board.dto.BoardSearchDTO;
import jmnet.moka.core.tps.mvc.board.entity.Board;
import jmnet.moka.core.tps.mvc.board.entity.QBoard;
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
 * ClassName : BoardRepositorySupportImpl
 * Created : 2020-12-17 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-17 11:59
 */
public class BoardRepositorySupportImpl extends QuerydslRepositorySupport implements BoardRepositorySupport {

    public BoardRepositorySupportImpl() {
        super(Board.class);
    }

    @Override
    public Page<Board> findAllBoard(BoardSearchDTO searchDTO) {
        QBoard qBoard = QBoard.board;
        QMemberInfo qMember = QMemberInfo.memberInfo;

        JPQLQuery<Board> query = from(qBoard);

        Pageable pageable = searchDTO.getPageable();
        if (McpString.isYes(searchDTO.getUseTotal())) {
            query = getQuerydsl().applyPagination(pageable, query);
        }

        QueryResults<Board> list = query.fetchResults();

        return new PageImpl<Board>(list.getResults(), pageable, list.getTotal());
    }

    
}
