import React from 'react';
import { MokaCard } from '@components';
import Search from './PageChildContainerSearch';
import AgGrid from './PageChildContainerAgGrid';

/**
 * 관련 컨테이너
 */
const PageChildContainerList = (props) => {
    return (
        <MokaCard title="컨테이너 검색" titleClassName="mb-0">
            {/* 검색 및 버튼 */}
            <Search />
            {/* 목록 및 페이징 */}
            <AgGrid />
        </MokaCard>
    );
};

export default PageChildContainerList;
