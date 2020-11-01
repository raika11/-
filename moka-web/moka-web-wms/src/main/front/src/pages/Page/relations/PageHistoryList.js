import React from 'react';
import { MokaCard } from '@components';
import Search from './PageHistorySearch';
import AgGrid from './PageHistoryAgGrid';

/**
 * 페이지 히스토리
 */
const PageHistoryList = (props) => {
    const { show } = props;

    return (
        <MokaCard title="페이지 히스토리" titleClassName="mb-0">
            <Search show={show} />
            <AgGrid show={show} />
        </MokaCard>
    );
};

export default PageHistoryList;
