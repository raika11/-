import React from 'react';
import { ABSearch } from '../components';
import AgGrid from './DirectAgGrid';

/**
 * A/B 테스트 > 직접 설계 > 리스트
 */
const DirectList = (props) => {
    return (
        <React.Fragment>
            <ABSearch {...props} />
            <AgGrid {...props} />
        </React.Fragment>
    );
};

export default DirectList;
