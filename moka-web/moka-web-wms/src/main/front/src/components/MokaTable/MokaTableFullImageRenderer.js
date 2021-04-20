import React, { forwardRef } from 'react';
import MokaTableImageRenderer from './MokaTableImageRenderer';

/**
 * ag-grid 셀에 이미지를 그리는 컴포넌트 (풀이미지)
 * @param {object} params ag grid params
 */
const MokaTableFullImageRenderer = forwardRef((params, ref) => <MokaTableImageRenderer ref={ref} {...params} autoRatio={false} roundeCircle={false} />);

export default MokaTableFullImageRenderer;
