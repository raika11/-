import React from 'react';
import { ABSearch } from '../components';
import AgGrid from './EditAgGrid';

/**
 * A/B 테스트 > 대안 설계 > 리스트
 */
const EditList = (props) => {
    return (
        <React.Fragment>
            <ABSearch {...props} />
            <AgGrid {...props} />
        </React.Fragment>
    );
};

export default EditList;
