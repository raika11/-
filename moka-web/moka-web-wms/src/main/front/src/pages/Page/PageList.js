import React from 'react';
import Search from './PageSearch';
import Tree from './PageTree';

const PageList = ({ onDelete }) => {
    return (
        <>
            <Search />
            <Tree onDelete={onDelete} />
        </>
    );
};

export default PageList;
