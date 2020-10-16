import React from 'react';

import { MokaCard } from '@components';
import Search from './PageChildTemplateSearch';
import AgGrid from './PageChildTemplateAgGrid';

/**
 * 관련 컨테이너
 */
const PageChildTemplateList = () => {
    return (
        <MokaCard titleClassName="mb-0" title="템플릿 검색">
            {/* 검색 및 버튼 */}
            <Search />
            {/* 목록 및 페이징 */}
            <AgGrid />
        </MokaCard>
    );
};

export default PageChildTemplateList;
