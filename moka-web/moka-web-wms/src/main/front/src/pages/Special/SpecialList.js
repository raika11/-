import React from 'react';
import Search from './SpecialSearch';
import AgGrid from './SpecialAgGrid';

const SpecialList = (props) => {
    const { onRowClicked } = props;

    return (
        <>
            <Search />
            <AgGrid onRowClicked={onRowClicked} />
        </>
    );
};

export default SpecialList;
