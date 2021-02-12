import React from 'react';
import { MokaCard } from '@components';
import TreeBox from './TreeBox';

const BoardsGroupTree = () => {
    return (
        <MokaCard width={230} className="mr-gutter" title="게시판 목록" bodyClassName="d-flex flex-column px-2">
            <TreeBox />
        </MokaCard>
    );
};

export default BoardsGroupTree;
