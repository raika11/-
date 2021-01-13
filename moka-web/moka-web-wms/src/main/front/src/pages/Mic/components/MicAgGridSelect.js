import React, { useState } from 'react';
import { MokaInput } from '@/components';

/**
 * 시민 마이크 AgGrid 셀렉트
 */
const MicAgGridSelect = () => {
    const [state, setState] = useState('0');

    return (
        <MokaInput as="select" className="ft-12" value={state} onChange={(e) => setState(e.target.value)}>
            <option value="0">등록</option>
            <option value="1">귀 쫑긋</option>
            <option value="2">PICK</option>
        </MokaInput>
    );
};

export default MicAgGridSelect;
