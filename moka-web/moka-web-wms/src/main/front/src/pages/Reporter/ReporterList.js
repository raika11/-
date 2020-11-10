import React from 'react';
import Search from './ReporterSearch';
import AgGrid from './ReporterAgGrid';

/**
 * 기자 목록
 */
const ReporterList = () => {
    return (
        <>
            <Search />
            <AgGrid />
        </>
    );
};

export default ReporterList;
