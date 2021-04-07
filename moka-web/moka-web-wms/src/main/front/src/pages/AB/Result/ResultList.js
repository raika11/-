import React from 'react';
import { ABSearch } from '../components';
import AgGrid from './ResultAgGrid';

/**
 * A/B 테스트 > 테스트 결과 > 리스트
 */
const ResultList = (props) => {
    return (
        <React.Fragment>
            <ABSearch {...props} />
            <AgGrid {...props} />
        </React.Fragment>
    );
};

export default ResultList;
