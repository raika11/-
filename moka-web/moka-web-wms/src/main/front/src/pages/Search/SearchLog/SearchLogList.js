import React from 'react';
import SearchLogSearch from '@pages/Search/SearchLog/SearchLogSearch';
import SearchLogOverallStatus from '@pages/Search/SearchLog/SearchLogOverallStatus';
import SearchLogAgGrid from '@pages/Search/SearchLog/SearchLogAgGrid';

const SearchLogList = () => {
    return (
        <>
            <SearchLogSearch />
            <SearchLogOverallStatus />
            <SearchLogAgGrid />
        </>
    );
};

export default SearchLogList;
