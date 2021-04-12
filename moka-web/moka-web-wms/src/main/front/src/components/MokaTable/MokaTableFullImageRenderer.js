import React, { forwardRef } from 'react';
import MokaTableImageRenderer from './MokaTableImageRenderer';

/**
 * ag-grid 셀에 자동 비율(16:9)가 아닌 full 이미지를 그리는 컴포넌트.
 *
 * @param {object} params ag grid params
 */
const MokaTableFullImageRenderer = forwardRef((params, ref) => {
    return <MokaTableImageRenderer ref={ref} {...params} autoRatio={false} />;
});

export default MokaTableFullImageRenderer;
