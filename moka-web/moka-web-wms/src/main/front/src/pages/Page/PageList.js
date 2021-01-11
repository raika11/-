import React from 'react';
import Search from './PageSearch';
import Tree from './PageTree';

const PageList = ({ onDelete, match }) => {
    return (
        <>
            <Search match={match} />
            <Tree onDelete={onDelete} match={match} />
        </>
    );
};

export default PageList;
