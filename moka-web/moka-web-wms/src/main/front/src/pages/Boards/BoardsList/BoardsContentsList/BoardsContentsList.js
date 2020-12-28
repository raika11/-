import React from 'react';
import { MokaCard } from '@components';

import SearchBox from './SearchBox';
import ContentsListGrid from './ContentsListGrid';

const BoardsContentsList = () => {
    return (
        <MokaCard width={850} className="mr-gutter" headerClassName="pb-0" title="공지 목록" titleClassName="mb-0" bodyClassName="d-flex flex-column">
            <SearchBox />
            <ContentsListGrid />
        </MokaCard>
    );
};

export default BoardsContentsList;
