import React from 'react';
import SystemLogSearch from '@pages/SystemLog/SystemLogSearch';
import SystemLogAgGrid from '@pages/SystemLog/SystemLogAgGrid';

const SystemLogList = () => {
    return (
        <>
            <SystemLogSearch />
            <SystemLogAgGrid />
        </>
    );
};

export default SystemLogList;
