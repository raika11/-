import React from 'react';
import Search from './ArticleCdnSearch';
import AgGrid from './ArticleCdnAgGrid';

const ArticleCdnList = (props) => {
    return (
        <React.Fragment>
            <Search {...props} />
            <AgGrid {...props} />
        </React.Fragment>
    );
};

export default ArticleCdnList;
