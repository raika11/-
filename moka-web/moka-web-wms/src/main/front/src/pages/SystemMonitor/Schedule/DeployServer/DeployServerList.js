import React from 'react';
import Search from './DeployServerSearch';
import AgGrid from './DeployServerAgGrid';

/**
 * 스케줄 서버 관리 > 배포 서버 관리 목록
 */
const DeployServerList = () => {
    return (
        <>
            <Search />
            <AgGrid />
        </>
    );
};

export default DeployServerList;
