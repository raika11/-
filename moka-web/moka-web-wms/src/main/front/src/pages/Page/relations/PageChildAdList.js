import React from 'react';
import { MokaCard } from '@components';
import Search from './PageChildAdSearch';
import AgGrid from './PageChildAdAgGrid';

/**
 * 관련광고
 */
const PageChildAdList = () => {
    return (
        <MokaCard title="광고 검색" titleClassName="mb-0">
            <Search />
            <AgGrid />
        </MokaCard>
    );
};

export default PageChildAdList;
