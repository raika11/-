import React from 'react';
import { MokaCard } from '@components';
import Search from './TemplateHistorySearch';
import AgGrid from './TemplateHistoryAgGrid';

/**
 * 템플릿 히스토리
 */
const TemplateHistoryList = () => {
    return (
        <MokaCard title="템플릿 히스토리" titleClassName="mb-0">
            <Search />
            <AgGrid />
        </MokaCard>
    );
};

export default TemplateHistoryList;
