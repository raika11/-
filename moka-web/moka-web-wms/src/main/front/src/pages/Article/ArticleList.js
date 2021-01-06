import React from 'react';
import ArticleSearch from './ArticleSearch';
import ArticleAgGrid from './ArticleAgGrid';

const ArticleList = (props) => {
    return (
        <>
            <ArticleSearch {...props} />
            <ArticleAgGrid {...props} />
        </>
    );
};

export default ArticleList;
