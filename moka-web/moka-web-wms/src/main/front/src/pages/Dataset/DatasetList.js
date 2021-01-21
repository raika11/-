import React from 'react';
import Search from './DatasetSearch';
import AgGrid from './DatasetAgGrid';

/**
 * 데이터셋 리스트 컴포넌트
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
