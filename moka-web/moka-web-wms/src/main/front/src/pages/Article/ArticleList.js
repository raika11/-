import React from 'react';
import ArticleSearch from './ArticleSearch';
import ArticleAgGrid from './ArticleAgGrid';

const ArticleList = ({ className }) => {
    return (
        <div className={className}>
            <ArticleSearch />
            <ArticleAgGrid />
        </div>
    );
};

export default ArticleList;
