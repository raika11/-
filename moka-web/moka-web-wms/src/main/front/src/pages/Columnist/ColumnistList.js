import React from 'react';
import Search from './ColumnistSearch';
import AgGrid from './ColumnistAgGrid';

const ColumnistList = (props) => {
    return (
        <>
            <Search {...props} />
            <AgGrid {...props} />
        </>
    );
};

export default ColumnistList;
