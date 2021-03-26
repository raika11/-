package jmnet.moka.core.tps.mvc.board.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.JPQLQuery;
import java.util.Optional;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.TpsConstants;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.board.dto.BoardSearchDTO;
import jmnet.moka.core.tps.mvc.board.dto.JpodNoticeSearchDTO;
import jmnet.moka.core.tps.mvc.board.entity.Board;
import jmnet.moka.core.tps.mvc.board.entity.JpodBoard;
import jmnet.moka.core.tps.mvc.board.entity.QBoard;
import jmnet.moka.core.tps.mvc.board.entity.QBoardInfo;
import jmnet.moka.core.tps.mvc.board.entity.QJpodBoard;
import jmnet.moka.core.tps.mvc.jpod.entity.QJpodChannel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.transaction.annotation.Transactional;

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
public class BoardRepositorySupportImpl extends TpsQueryDslRepositorySupport implements BoardRepositorySupport {

    public BoardRepositorySupportImpl() {
        super(Board.class);
    }

    @Override
    public Page<Board> findAllBoard(Integer boardId, BoardSearchDTO searchDTO) {
        QBoard qBoard = QBoard.board;
        QBoard board = QBoard.board;
        QJpodChannel qJpodChannel = QJpodChannel.jpodChannel;

        JPQLQuery<Board> query = from(qBoard);
        JPQLQuery<Long> subQuery = JPAExpressions
                .select(board.parentBoardSeq)
                .from(board);

        query.where(qBoard.boardId.eq(boardId));

        if (McpString.isNotEmpty(searchDTO.getDelYn())) {
            query.where(qBoard.boardId
                    .eq(boardId)
                    .and(qBoard.delYn.eq(searchDTO.getDelYn())));
        } else {
            query.where(qBoard.boardId.eq(boardId));
        }

        subQuery.where(board.boardId
                .eq(boardId)
                .and(board.depth.eq(0)));

        //검색조건 : 조회시작일자
        if (searchDTO.getStartDt() != null && searchDTO.getEndDt() != null) {
            subQuery.where(board.regDt.between(searchDTO.getStartDt(), searchDTO.getEndDt()));
        } else if (searchDTO.getStartDt() != null) {
            subQuery.where(board.regDt.goe(searchDTO.getStartDt()));
        } else if (searchDTO.getEndDt() != null) {
            subQuery.where(board.regDt.loe(searchDTO.getEndDt()));
        } else {
            // 아무것도 안함
        }

        if (McpString.isNotEmpty(searchDTO.getTitlePrefix1())) {
            subQuery.where(board.titlePrefix1.eq(searchDTO.getTitlePrefix1()));
        }

        if (McpString.isNotEmpty(searchDTO.getAnswYn())) {
            subQuery.where(board.answYn.eq(searchDTO.getAnswYn()));
        }

        if (McpString.isNotEmpty(searchDTO.getKeyword())) {
            String keyword = searchDTO
                    .getKeyword()
                    .toUpperCase();
            subQuery.where(board.title
                    .toUpperCase()
                    .contains(keyword)
                    .or(board.content
                            .toUpperCase()
                            .contains(keyword))
                    .or(board.regName
                            .toUpperCase()
                            .contains(keyword)));
        }

        if (McpString.isNotEmpty(searchDTO.getChannelId()) && searchDTO.getChannelId() > 0) {
            subQuery.where(board.channelId.eq(searchDTO.getChannelId()));
        }

        query.where(qBoard.parentBoardSeq.in(subQuery));

        Pageable pageable = searchDTO.getPageable();
        if (McpString.isYes(searchDTO.getUseTotal())) {
            query = getQuerydsl().applyPagination(pageable, query);
        }

        query.orderBy(qBoard.ordNo.asc(), qBoard.parentBoardSeq.desc(), qBoard.depth.asc(), qBoard.indent.asc());

        QueryResults<Board> list = query
                .join(qBoard.boardInfo)
                .fetchJoin()
                .fetchResults();

        return new PageImpl<Board>(list.getResults(), pageable, list.getTotal());
    }

    @Override
    @EntityGraph(attributePaths = {"boardInfo", "attaches", "jpodChannel"}, type = EntityGraph.EntityGraphType.LOAD)
    public Page<JpodBoard> findAllJpodNotice(JpodNoticeSearchDTO searchDTO) {
        QJpodBoard qBoard = QJpodBoard.jpodBoard;
        QJpodBoard board = QJpodBoard.jpodBoard;
        QBoardInfo boardInfo = QBoardInfo.boardInfo;

        JPQLQuery<JpodBoard> query = from(qBoard);
        JPQLQuery<Long> subQuery = JPAExpressions
                .select(board.parentBoardSeq)
                .from(board);

        subQuery.where(board.boardId.eq(JPAExpressions
                .select(board.boardId)
                .from(boardInfo)
                .where(board.boardInfo.channelType
                        .eq(TpsConstants.BOARD_JPOD)
                        .and(board.depth.eq(0)))));

        //검색조건 : 조회시작일자
        if (searchDTO.getStartDt() != null && searchDTO.getEndDt() != null) {
            subQuery.where(board.regDt.between(searchDTO.getStartDt(), searchDTO.getEndDt()));
        } else if (searchDTO.getStartDt() != null) {
            subQuery.where(board.regDt.goe(searchDTO.getStartDt()));
        } else if (searchDTO.getEndDt() != null) {
            subQuery.where(board.regDt.loe(searchDTO.getEndDt()));
        } else {
            // 아무것도 안함
        }
        if (McpString.isNotEmpty(searchDTO.getDelYn())) {
            subQuery.where(board.delYn.eq(searchDTO.getDelYn()));
        }

        if (McpString.isNotEmpty(searchDTO.getKeyword())) {
            String keyword = searchDTO
                    .getKeyword()
                    .toUpperCase();
            subQuery.where(board.title
                    .toUpperCase()
                    .contains(keyword)
                    .or(board.content
                            .toUpperCase()
                            .contains(keyword))
                    .or(board.regName
                            .toUpperCase()
                            .contains(keyword)));
        }

        if (McpString.isNotEmpty(searchDTO.getChannelId()) && searchDTO.getChannelId() > 0) {
            subQuery.where(board.channelId.eq(searchDTO.getChannelId()));
        }

        Pageable pageable = searchDTO.getPageable();
        if (McpString.isYes(searchDTO.getUseTotal())) {
            query = getQuerydsl().applyPagination(pageable, query);
        }

        query.where(qBoard.parentBoardSeq.in(subQuery));

        query.orderBy(qBoard.ordNo.asc(), qBoard.parentBoardSeq.desc(), qBoard.depth.asc(), qBoard.indent.asc());

        QueryResults<JpodBoard> list = query
                .join(qBoard.boardInfo)
                .fetchJoin()
                .join(qBoard.jpodChannel)
                .fetchJoin()
                .fetchResults();

        return new PageImpl<JpodBoard>(list.getResults(), pageable, list.getTotal());
    }

    @Override
    @Transactional
    public long updateParentBoardSeq(Long boardSeq, Long parentBoardSeq) {
        QBoard qBoard = QBoard.board;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qBoard.boardSeq.eq(boardSeq));
        return update(qBoard)
                .where(builder)
                .set(qBoard.parentBoardSeq, parentBoardSeq)
                .execute();
    }

    @Override
    public long updateOrdNo(Long boardSeq, Integer ordNo) {
        QBoard qBoard = QBoard.board;
        QBoard board = QBoard.board;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qBoard.parentBoardSeq.eq(JPAExpressions
                .select(board.parentBoardSeq)
                .from(board)
                .where(board.boardSeq.eq(boardSeq))));
        return update(qBoard)
                .where(builder)
                .set(qBoard.ordNo, ordNo)
                .execute();
    }

    @Override
    @Transactional
    public long updateViewCnt(Long boardSeq) {
        QBoard qBoard = QBoard.board;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qBoard.boardSeq.eq(boardSeq));
        return update(qBoard)
                .where(builder)
                .set(qBoard.viewCnt, qBoard.viewCnt.add(1))
                .execute();
    }

    @Override
    @Transactional
    public long updateRecomCnt(Long boardSeq, boolean add) {
        QBoard qBoard = QBoard.board;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qBoard.boardSeq.eq(boardSeq));
        return update(qBoard)
                .where(builder)
                .set(qBoard.recomCnt, qBoard.recomCnt.add(add ? 1 : -1))
                .execute();
    }

    @Override
    @Transactional
    public long updateDecomCnt(Long boardSeq, boolean add) {
        QBoard qBoard = QBoard.board;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qBoard.boardSeq.eq(boardSeq));
        return update(qBoard)
                .where(builder)
                .set(qBoard.decomCnt, qBoard.decomCnt.add(add ? 1 : -1))
                .execute();
    }

    @Override
    @Transactional
    public long updateDeclareCnt(Long boardSeq, boolean add) {
        QBoard qBoard = QBoard.board;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qBoard.boardSeq.eq(boardSeq));
        return update(qBoard)
                .where(builder)
                .set(qBoard.declareCnt, qBoard.declareCnt.add(add ? 1 : -1))
                .execute();
    }

    @Override
    public Optional<Board> findByBoardSeq(Long boardSeq) {
        QBoard qBoard = QBoard.board;
        QBoardInfo qBoardInfo = QBoardInfo.boardInfo;

        JPQLQuery<Board> query = from(qBoard);

        query.where(qBoard.boardSeq
                .eq(boardSeq)
                .and(qBoard.delYn.eq(MokaConstants.NO)));

        Board board = query
                .innerJoin(qBoard.boardInfo, qBoardInfo)
                .fetchJoin()
                .fetchFirst();

        return Optional.ofNullable(board);
    }

    @Override
    public Long countByParentBoardSeq(Long parentBoardSeq, String delYn) {
        QBoard qBoard = QBoard.board;

        JPQLQuery<Board> query = from(qBoard);

        query.where(qBoard.boardSeq
                .ne(parentBoardSeq)
                .and(qBoard.parentBoardSeq.eq(parentBoardSeq))
                .and(qBoard.delYn.eq(MokaConstants.NO)));

        return query.fetchCount();
    }

    @Override
    public Integer findByMaxDepth(Long parentBoardSeq) {
        QBoard qBoard = QBoard.board;

        JPQLQuery<Board> query = from(qBoard);

        return query
                .select(qBoard.depth)
                .where(qBoard.parentBoardSeq.eq(parentBoardSeq))
                .orderBy(qBoard.depth.desc())
                .fetchFirst();
    }


}
