import React from 'react';
import { MokaCard } from '@components';

import TreeBox from './TreeBox';

const BoardsGroupTree = () => {
    return (
        <>
            <MokaCard width={230} className="mr-gutter" headerClassName="pb-0" title="게시판 목록" titleClassName="mb-0" bodyClassName="d-flex flex-column">
                <TreeBox />
            </MokaCard>
        </>
    );
};

export default BoardsGroupTree;
