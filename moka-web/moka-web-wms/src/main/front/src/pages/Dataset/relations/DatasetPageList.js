import React from 'react';
import { MokaCard } from '@components';
import Search from './DatasetPageSearch';
import AgGrid from './DatasetPageAgGrid';

/**
 * 관련페이지 컴포넌트
 */
const DatasetPageList = () => (
    <MokaCard titleClassName="h-100 mb-0" title="페이지 검색">
        <Search />
        <AgGrid />
    </MokaCard>
);

export default DatasetPageList;
