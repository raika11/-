import React from 'react';
import { useParams } from 'react-router-dom';
import SearchLogDetailInfoHeader from '@pages/Search/SearchLog/SearchLogDetailInfoHeader';
import { MokaCard } from '@components';
import SearchLogDetailInfoAgGrid from '@pages/Search/SearchLog/SearchLogDetailInfoAgGrid';

const SearchLogDetailInfo = () => {
    const { keyword } = useParams();

    return (
        <MokaCard className="mr-gutter flex-fill" titleClassName="mb-0" title="검색 상세 정보">
            <SearchLogDetailInfoHeader keyword={keyword} />
            <SearchLogDetailInfoAgGrid />
        </MokaCard>
    );
};

export default SearchLogDetailInfo;
