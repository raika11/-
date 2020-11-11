import React from 'react';
import ArticleSearch from './ArticleSearch';
import ArticleAgGrid from './ArticleAgGrid';

const ArticleList = () => {
    return (
        <div className="px-3 pb-3 pt-1">
            <ArticleSearch />
            <ArticleAgGrid />
        </div>
    );
};

export default ArticleList;
