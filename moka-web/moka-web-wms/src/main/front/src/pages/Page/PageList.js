import React from 'react';
import Search from './PageSearch';
import Tree from './PageTree';

const PageList = (props) => {
    return (
        <>
            <Search {...props} />
            <Tree {...props} />
        </>
    );
};

export default PageList;
