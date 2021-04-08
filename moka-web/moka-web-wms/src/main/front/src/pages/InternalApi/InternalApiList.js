import React from 'react';
import Search from './InternalApiSearch';
import AgGrid from './InternalApiAgGrid';

/**
 * API 관리 > API 목록
 */
const InternalApiList = (props) => {
    return (
        <>
            <Search {...props} />
            <AgGrid {...props} />
        </>
    );
};

export default InternalApiList;
