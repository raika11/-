import React from 'react';
import { MokaCard } from '@components';
import BoardsGroupTree from './BoardsGroupTree';

/**
 * 게시판 관리 > 게시글 관리 > 게시판 목록
 */
const BoardsGroupList = () => {
    return (
        <MokaCard className="w-100" title="게시판 목록" bodyClassName="d-flex flex-column">
            <BoardsGroupTree />
        </MokaCard>
    );
};

export default BoardsGroupList;
