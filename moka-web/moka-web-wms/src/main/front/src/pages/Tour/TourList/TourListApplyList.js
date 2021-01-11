import React from 'react';
import Search from './TourListSearch';
import AgGrid from './TourListAgGrid';

/**
 * 신청목록
 */
const TourListApplyList = () => {
    return (
        <>
            <Search />
            <AgGrid />
        </>
    );
};

export default TourListApplyList;
