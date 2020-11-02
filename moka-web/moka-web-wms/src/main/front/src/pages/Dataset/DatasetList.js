import React from 'react';
import Search from './DatasetSearch';
import AgGrid from './DatasetAgGrid';

/**
 * 데이터셋 리스트 컴포넌트
 */
const DatasetList = (props) => {
    const { onDelete } = props;
    return (
        <>
            <Search />
            <AgGrid onDelete={onDelete} />
        </>
    );
};

export default DatasetList;
