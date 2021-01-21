import React from 'react';
import Search from './DeleteWorkSearch';
import AgGrid from './DeleteWorkAgGrid';

/**
 * 스케줄 서버 관리 > 삭제 작업 목록
 */
const DeleteWorkList = () => {
    return (
        <>
            <Search />
            <AgGrid />
        </>
    );
};

export default DeleteWorkList;
