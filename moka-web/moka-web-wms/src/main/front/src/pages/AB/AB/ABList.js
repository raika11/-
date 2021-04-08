import React from 'react';
import { ABSearch } from '../components';
import AgGrid from './ABAgGrid';

/**
 * A/B 테스트 > 전체 목록 > 리스트
 */
const ABList = (props) => {
    return (
        <React.Fragment>
            <ABSearch {...props} />
            <AgGrid {...props} />
        </React.Fragment>
    );
};

export default ABList;
