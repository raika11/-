package jmnet.moka.core.tps.mvc.board.repository;

import com.querydsl.core.QueryResults;
import com.querydsl.jpa.JPQLQuery;
import jmnet.moka.common.utils.McpString;
import jmnet.moka.core.tps.config.TpsQueryDslRepositorySupport;
import jmnet.moka.core.tps.mvc.board.dto.BoardInfoSearchDTO;
import jmnet.moka.core.tps.mvc.board.entity.BoardInfo;
import jmnet.moka.core.tps.mvc.board.entity.QBoardInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

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
public class BoardInfoRepositorySupportImpl extends TpsQueryDslRepositorySupport implements BoardInfoRepositorySupport {

    public BoardInfoRepositorySupportImpl() {
        super(BoardInfo.class);
    }

    public Page<BoardInfo> findAllBoardInfo(BoardInfoSearchDTO searchDTO) {
        QBoardInfo qBoardInfo = QBoardInfo.boardInfo;

        JPQLQuery<BoardInfo> query = from(qBoardInfo);

        if (McpString.isNotEmpty(searchDTO.getUsedYn())) {
            query.where(qBoardInfo.usedYn.eq(searchDTO.getUsedYn()));
        }

        if (McpString.isNotEmpty(searchDTO.getBoardType())) {
            query.where(qBoardInfo.boardType.eq(searchDTO.getBoardType()));
        }

        if (McpString.isNotEmpty(searchDTO.getKeyword())) {
            query.where(qBoardInfo.boardName
                    .contains(searchDTO.getKeyword())
                    .or(qBoardInfo.boardDesc.contains(searchDTO.getKeyword())));
        }

        // 채널 타입으로 검색 기능 추가
        if (McpString.isNotEmpty(searchDTO.getChannelType())) {
            query.where(qBoardInfo.channelType.eq(searchDTO.getChannelType()));
        }

        Pageable pageable = searchDTO.getPageable();
        if (McpString.isYes(searchDTO.getUseTotal()) && getQuerydsl() != null) {
            query = getQuerydsl().applyPagination(pageable, query);
        }

        QueryResults<BoardInfo> list = query.fetchResults();

        return new PageImpl<>(list.getResults(), pageable, list.getTotal());
    }
}
