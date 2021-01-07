import React from 'react';
import CommentGrid from './CommentGrid';
import Search from './CommentSearch';
const CommentLIst = (props) => {
    return (
        <>
            <Search />
            <CommentGrid />
        </>
    );
};

export default CommentLIst;
