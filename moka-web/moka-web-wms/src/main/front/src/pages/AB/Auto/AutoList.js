import React from 'react';
import { ABSearch } from '../components';
import AgGrid from './AutoAgGrid';

/**
 * A/B 테스트 > 직접 설계 > 리스트
 */
const AutoList = (props) => {
    return (
        <React.Fragment>
            <ABSearch {...props} />
            <AgGrid {...props} />
        </React.Fragment>
    );
};

export default AutoList;
