import React from 'react';
import Search from './DatasetSearch';
import AgGrid from './DatasetAgGrid';

/**
 * 데이터셋 관리 > 데이터셋 목록
 */
const DatasetList = (props) => {
    return (
        <>
            <Search {...props} />
            <AgGrid {...props} />
        </>
    );
};

export default DatasetList;
