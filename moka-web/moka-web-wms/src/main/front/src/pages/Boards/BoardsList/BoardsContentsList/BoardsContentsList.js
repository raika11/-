import React from 'react';
import { MokaCard } from '@components';
import { useSelector } from 'react-redux';

import SearchBox from './SearchBox';
import ContentsListGrid from './ContentsListGrid';

const BoardsContentsList = () => {
    // tree 메뉴에서 산택한 게시판 정보.
    const { selectboard } = useSelector((store) => ({
        selectboard: store.board.listmenu.selectboard,
    }));

    return (
        <MokaCard width={750} className="mr-gutter" title={`${selectboard.boardName} 목록`} bodyClassName="d-flex flex-column">
            <SearchBox />
            <ContentsListGrid />
        </MokaCard>
    );
};

export default BoardsContentsList;
