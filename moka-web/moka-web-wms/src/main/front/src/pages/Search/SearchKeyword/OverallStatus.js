import React from 'react';
import OverallStatusHeader from './OverallStatusHeader';
import OverallStatusAgGrid from './OverallStatusAgGrid';

/**
 * 총 통계
 */
const OverallStatus = (props) => {
    return (
        <>
            <OverallStatusHeader {...props} />
            <OverallStatusAgGrid {...props} />
        </>
    );
};

export default OverallStatus;
