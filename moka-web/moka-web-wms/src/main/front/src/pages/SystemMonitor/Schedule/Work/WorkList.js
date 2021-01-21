import React from 'react';
import Search from './WorkSearch';
import AgGrid from './WorkAgGrid';

/**
 * 스케줄 서버 관리 > 작업 목록
 */
const WorkList = () => {
    return (
        <>
            <Search />
            <AgGrid />
        </>
    );
};

export default WorkList;
