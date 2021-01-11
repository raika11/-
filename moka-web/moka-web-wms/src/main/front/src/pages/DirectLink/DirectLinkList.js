import React from 'react';
import Search from './DirectLinkSearch';
import AgGrid from './DirectLinkAgGrid';

const DirectLinkList = (props) => {
    return (
        <React.Fragment>
            <Search {...props} />
            <AgGrid {...props} />
        </React.Fragment>
    );
};

export default DirectLinkList;
