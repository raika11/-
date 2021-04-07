import React from 'react';
import { ABSearch } from '../components';
import AgGrid from './JamAgGrid';

/**
 * A/B 테스트 > JAM 설계 > 리스트
 */
const JamList = (props) => {
    return (
        <React.Fragment>
            <ABSearch {...props} />
            <AgGrid {...props} />
        </React.Fragment>
    );
};

export default JamList;
