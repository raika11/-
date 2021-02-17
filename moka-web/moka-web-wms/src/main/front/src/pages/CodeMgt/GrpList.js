import React from 'react';
import Search from './GrpSearch';
import AgGrid from './GrpAgGrid';

/**
 * 그룹 목록
 */
const GrpList = (props) => {
    return (
        <React.Fragment>
            <Search {...props} />
            <AgGrid {...props} />
        </React.Fragment>
    );
};

export default GrpList;
