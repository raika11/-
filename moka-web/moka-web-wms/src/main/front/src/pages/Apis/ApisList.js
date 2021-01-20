import React from 'react';
import Search from './ApisSearch';
import AgGrid from './ApisAgGrid';

/**
 * API 목록
 */
const ApisList = () => {
    return (
        <>
            <Search />
            <AgGrid />
        </>
    );
};

export default ApisList;
