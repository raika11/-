import React from 'react';
import Search from './RcvArticleSearch';
import AgGrid from './RcvArticleAgGrid';

const RcvArticleList = () => {
    return (
        <React.Fragment>
            <Search />
            <AgGrid />
        </React.Fragment>
    );
};

export default RcvArticleList;
