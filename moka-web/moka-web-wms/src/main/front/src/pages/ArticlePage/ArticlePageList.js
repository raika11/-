import React from 'react';
import Search from './ArticlePageSearch';
import AgGrid from './ArticlePageAgGrid';

const articlePageList = ({ onDelete }) => {
    return (
        <>
            <Search />
            <AgGrid onDelete={onDelete} />
        </>
    );
};

export default articlePageList;
