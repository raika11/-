import React from 'react';
import AgGrid from './CommentAgGrid';
import Search from './CommentSearch';
const CommentLIst = (props) => {
    return (
        <>
            <Search />
            <AgGrid />
        </>
    );
};

export default CommentLIst;
