import React from 'react';
import Search from './SearchKeywordSearch';
import OverallStatus from './OverallStatus';
import AgGrid from './SearchKeywordAgGrid';

/**
 * 검색로그 리스트
 */
const SearchKeywordList = (props) => {
    return (
        <>
            <Search {...props} />
            <OverallStatus {...props} />
            {/* <AgGrid {...props} /> */}
        </>
    );
};

export default SearchKeywordList;
