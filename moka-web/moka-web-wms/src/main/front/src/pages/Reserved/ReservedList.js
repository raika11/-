import React from 'react';
import Search from './ReservedSearch';
import AgGrid from './ReservedAgGrid';

/**
 * 예약어 목록
 */
const ReservedList = (props) => {
    return (
        <>
            <Search {...props} />
            <AgGrid {...props} />
        </>
    );
};

export default ReservedList;
