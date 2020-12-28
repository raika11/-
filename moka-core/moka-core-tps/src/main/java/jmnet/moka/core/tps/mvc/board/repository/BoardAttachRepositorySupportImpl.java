package jmnet.moka.core.tps.mvc.board.repository;

import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.board.entity.BoardAttach;
import jmnet.moka.core.tps.mvc.board.entity.QBoardAttach;

/**
 * <pre>
 *
 * Project : moka
 * Package : jmnet.moka.core.tps.mvc.board.repository
 * ClassName : BoardAttachRepositorySupportImpl
 * Created : 2020-12-17 ince
 * </pre>
 *
 * @author ince
 * @since 2020-12-17 13:51
 */
public class BoardAttachRepositorySupportImpl extends TpsQueryDslRepositorySupport implements BoardAttachRepositorySupport {

    public BoardAttachRepositorySupportImpl() {
        super(BoardAttach.class);
    }

    @Override
    public void deleteByBoardSeq(Long boardSeq) {
        QBoardAttach qBoardAttach = QBoardAttach.boardAttach;

        delete(qBoardAttach)
                .where(qBoardAttach.boardSeq.eq(boardSeq))
                .execute();
    }
}
