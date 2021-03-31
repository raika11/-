import React, { forwardRef } from 'react';
import MokaTableImageRenderer from './MokaTableImageRenderer';

/**
 * ag-grid 셀에 라운드 (.rounded-circle) 이미지를 그리는 컴포넌트.
 *
 * @param {object} params ag grid params
 */
const MokaTableCircleImageRenderer = forwardRef((params, ref) => {
    return <MokaTableImageRenderer ref={ref} {...params} roundedCircle />;
});

export default MokaTableCircleImageRenderer;
