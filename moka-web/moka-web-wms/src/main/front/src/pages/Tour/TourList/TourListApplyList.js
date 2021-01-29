import React from 'react';
import Search from './TourListSearch';
import AgGrid from './TourListAgGrid';

/**
 * 신청 목록
 */
const TourListApplyList = ({ match }) => {
    return (
        <>
            <Search match={match} />
            <AgGrid match={match} />
        </>
    );
};

export default TourListApplyList;
