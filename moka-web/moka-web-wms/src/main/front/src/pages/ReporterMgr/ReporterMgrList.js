import React from 'react';
import ReporterMgrAgGrid from './ReporterMgrAgGrid';
import Search from './ReporterMgrSearch';

/**
 * 도메인 관리 리스트
 */
const ReporterMgrList = () => {
    return (
        <>
            <Search />
            <ReporterMgrAgGrid />
        </>
    );
};

export default ReporterMgrList;
