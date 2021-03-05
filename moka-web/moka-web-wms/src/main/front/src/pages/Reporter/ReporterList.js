import React from 'react';
import Search from './ReporterSearch';
import AgGrid from './ReporterAgGrid';

/**
 * 기자 관리 > 기자 목록
 */
const ReporterList = (props) => {
    return (
        <>
            <Search {...props} />
            <AgGrid {...props} />
        </>
    );
};

export default ReporterList;
