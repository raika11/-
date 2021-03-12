import React from 'react';
import { MokaCard } from '@components';
import TreeBox from './TreeBox';

const BoardsGroupTree = () => {
    return (
        <MokaCard className="w-100" title="게시판 목록" bodyClassName="d-flex flex-column px-2">
            <TreeBox />
        </MokaCard>
    );
};

export default BoardsGroupTree;
