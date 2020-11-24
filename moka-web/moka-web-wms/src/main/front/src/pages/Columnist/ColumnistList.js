import React from 'react';
import Search from './ColumnistSearch';
import AgGrid from './ColumnistAgGrid';

const ColumnistList = () => {
    return (
        <React.Fragment>
            <Search />
            <AgGrid />
        </React.Fragment>
    );
};

export default ColumnistList;
