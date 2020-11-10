import React from 'react';
import Search from './ReporterMgrSearch';
import AgGrid from './ReporterMgrAgGrid';

/**
 * 기자 목록
 */
const ReporterMgrList = () => {
    return (
        <>
            <Search />
            <AgGrid />
        </>
    );
};

export default ReporterMgrList;
