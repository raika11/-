import React from 'react';
import Search from './PageSearch';
import Tree from './PageTree';

const PageList = ({ onDelete, match, findNode }) => {
    return (
        <>
            <Search match={match} />
            <Tree onDelete={onDelete} match={match} findNode={findNode} />
        </>
    );
};

export default PageList;
