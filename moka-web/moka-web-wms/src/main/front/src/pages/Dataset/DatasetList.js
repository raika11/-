import React from 'react';
import Search from './DatasetSearch';
import AgGrid from './DatasetAgGrid';
import PropTypes from 'prop-types';

const propTypes = {
    onDelete: PropTypes.func.isRequired,
};

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

DatasetList.prototype = propTypes;

export default DatasetList;
