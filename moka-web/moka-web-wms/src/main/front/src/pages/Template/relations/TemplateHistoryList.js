import React from 'react';
import { MokaCard } from '@components';
import Search from './TemplateHistorySearch';
import AgGrid from './TemplateHistoryAgGrid';

/**
 * 템플릿 히스토리
 */
const TemplateHistoryList = (props) => {
    const { show } = props;

    return (
        <MokaCard title="템플릿 히스토리" titleClassName="mb-0">
            <Search show={show} />
            <AgGrid show={show} />
        </MokaCard>
    );
};

export default TemplateHistoryList;
