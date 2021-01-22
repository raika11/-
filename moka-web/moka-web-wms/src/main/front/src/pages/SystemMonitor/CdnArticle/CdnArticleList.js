import React from 'react';
import Search from './CdnArticleSearch';
import AgGrid from './CdnArticleAgGrid';

const ArticleCdnList = (props) => {
    return (
        <React.Fragment>
            <Search {...props} />
            <AgGrid {...props} />
        </React.Fragment>
    );
};

export default ArticleCdnList;
