import React from 'react';
import Search from './ABSearch';
import AgGrid from './ABAgGrid';

/**
 * A/B 테스트 > 전체 목록 > 리스트
 */
const ABList = (props) => {
    return (
        <React.Fragment>
            <Search {...props} />
            <AgGrid {...props} />
        </React.Fragment>
    );
};

export default ABList;
