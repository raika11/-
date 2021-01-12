import React from 'react';
import SearchLogDetailInfoHeader from '@pages/Search/SearchLog/SearchLogDetailInfoHeader';
import { MokaCard } from '@components';
import SearchLogDetailInfoAgGrid from '@pages/Search/SearchLog/SearchLogDetailInfoAgGrid';

const SearchLogDetailInfo = () => {
    return (
        <MokaCard className="mr-gutter flex-fill" titleClassName="mb-0" title="검색 상세 정보">
            <SearchLogDetailInfoHeader />
            <SearchLogDetailInfoAgGrid />
        </MokaCard>
    );
};

export default SearchLogDetailInfo;
