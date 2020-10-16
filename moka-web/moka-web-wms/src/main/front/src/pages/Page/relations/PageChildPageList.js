import React from 'react';
import { MokaCard } from '@components';
import Search from './PageChildPageSearch';
import AgGrid from './PageChildPageAgGrid';

/**
 * 관련페이지
 */
const PageChildPageList = () => {
    return (
        <MokaCard titleClassName="mb-0" title="페이지 검색">
            {/* 검색 및 버튼 */}
            <Search />
            {/* 목록 및 페이징 */}
            <AgGrid />
        </MokaCard>
    );
};

export default PageChildPageList;
