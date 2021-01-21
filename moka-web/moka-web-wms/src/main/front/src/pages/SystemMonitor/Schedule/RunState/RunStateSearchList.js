import React from 'react';
import Search from './RunStateSearch';
import AgGrid from './RunStateSearchAgGrid';

/**
 * 스케줄 서버 관리 > 작업 실행상태 목록
 */
const RunStateSearchList = () => {
    return (
        <>
            <Search />
            <AgGrid />
        </>
    );
};

export default RunStateSearchList;
