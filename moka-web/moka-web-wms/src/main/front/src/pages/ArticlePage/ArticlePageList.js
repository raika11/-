import React from 'react';
import Search from './ArticlePageSearch';
import AgGrid from './ArticlePageAgGrid';

const articlePageList = (props) => {
    return (
        <>
            <Search {...props} />
            <AgGrid {...props} />
        </>
    );
};

export default articlePageList;
