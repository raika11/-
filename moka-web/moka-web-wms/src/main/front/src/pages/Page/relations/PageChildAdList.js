import React from 'react';
import { MokaCard } from '@components';
import Search from './PageChildAdSearch';
import AgGrid from './PageChildAdAgGrid';

/**
 * 관련광고
 */
const PageChildAdList = () => {
    return (
        <MokaCard title="관련 광고" titleClassName="mb-0">
            <Search />
            <AgGrid />
        </MokaCard>
    );
};

export default PageChildAdList;
