import React from 'react';
import MemberGroupAgGrid from './ReporterMgrAgGrid';
import Search from './ReporterMgrSearch';

/**
 * 도메인 관리 리스트
 */
const ReporterMgrList = () => {
    return (
        <>
            <Search />;
            <MemberGroupAgGrid />;
        </>
    );
};

export default ReporterMgrList;
