import React, { useEffect } from 'react';
import { MokaCard } from '@components';
import { BoardsSetGrid } from '@pages/Boards/BoardsSet/BoardsSetGrid';
import BoardsListSearchBox from './BoardsListSearchBox';

const BoardsList = () => {
    return (
        <>
            <MokaCard width={940} title="관리자 게시판 목록" loading={null} className="mr-gutter" titleClassName="mb-0" bodyClassName="d-flex flex-column">
                <BoardsListSearchBox />
                <BoardsSetGrid />
            </MokaCard>
        </>
    );
};

export default BoardsList;
