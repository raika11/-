import React, { useState } from 'react';
import { MokaCard } from '@components';

import AreaForm1Depth from './components/AreaForm1Depth';
import AreaForm2Depth from './components/AreaForm2Depth';
import AreaForm3Depth from './components/AreaForm3Depth';

const AreaEdit = () => {
    // state
    const [formType, setFormType] = useState('2depth');

    return (
        <MokaCard title="편집영역 등록" className="flex-fill">
            {/* 1뎁스 폼 */}
            {formType === '1depth' && <AreaForm1Depth />}
            {/* 2뎁스 폼 */}
            {formType === '2depth' && <AreaForm2Depth />}
            {/* 3뎁스 폼 */}
            {formType === '3depth' && <AreaForm3Depth />}
        </MokaCard>
    );
};

export default AreaEdit;
