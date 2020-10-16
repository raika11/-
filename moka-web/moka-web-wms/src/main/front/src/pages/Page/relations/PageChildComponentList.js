import React from 'react';
import { MokaCard } from '@components';
import Search from './PageChildComponentSearch';
import AgGrid from './PageChildComponentAgGrid';

/**
 * 관련 컴포넌트
 */
const PageChildComponentList = () => {
    return (
        <MokaCard title="컴포넌트 검색" titleClassName="mb-0">
            {/* 검색 및 버튼 */}
            <Search />
            {/* 목록 및 페이징 */}
            <AgGrid />
        </MokaCard>
    );
};

export default PageChildComponentList;
