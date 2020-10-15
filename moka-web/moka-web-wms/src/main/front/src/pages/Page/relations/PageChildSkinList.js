import React from 'react';
import { MokaCard } from '@components';
import Search from './PageChildSkinSearch';
import AgGrid from './PageChildSkinAgGrid';

/**
 * 관련 본문스킨
 */
const PageChildSkinList = () => {
    return (
        <MokaCard title="본문스킨 검색" titleClassName="mb-0">
            <Search />
            <AgGrid />
        </MokaCard>
    );
};

export default PageChildSkinList;
