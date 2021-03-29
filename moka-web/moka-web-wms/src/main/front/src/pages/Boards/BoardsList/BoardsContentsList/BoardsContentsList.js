import React from 'react';
import { useSelector } from 'react-redux';
import { MokaCard } from '@components';
import Search from './BoardContentsSearch';
import AgGrid from './BoardsContentsListAgGrid';

/**
 * 게시판 관리 > 게시글 관리 > 게시판 글 목록
 */
const BoardsContentsList = ({ match }) => {
    // 게시글 tree 메뉴에서 선택한 게시판 정보
    const selectBoard = useSelector((store) => store.board.listMenu.selectBoard);

    return (
        <MokaCard className="w-100" title={selectBoard.boardName ? `${selectBoard.boardName} 글 목록` : ''} bodyClassName="d-flex flex-column">
            <Search match={match} />
            <AgGrid match={match} />
        </MokaCard>
    );
};

export default BoardsContentsList;
