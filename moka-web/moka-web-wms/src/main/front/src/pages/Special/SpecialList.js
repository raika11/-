import React from 'react';
import Search from './SpecialSearch';
import AgGrid from './SpecialAgGrid';

const SpecialList = (props) => {
    return (
        <>
            <Search {...props} />
            <AgGrid {...props} />
        </>
    );
};

export default SpecialList;
