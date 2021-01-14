import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { MokaInput } from '@/components';

/**
 * 시민 마이크 포스트 AgGrid 셀렉트
 */
const PostSelectRenderer = forwardRef((params, ref) => {
    const { colDef } = params;
    const [state, setState] = useState('0');

    useImperativeHandle(
        ref,
        () => ({
            refresh: (newParam) => {
                if (newParam.data[colDef.field] !== params.data[colDef.field]) {
                    return true;
                } else {
                    return false;
                }
            },
        }),
        [colDef.field, params.data],
    );

    return (
        <MokaInput as="select" className="ft-12" value={state} onChange={(e) => setState(e.target.value)}>
            <option value="0">등록</option>
            <option value="1">귀 쫑긋</option>
            <option value="2">PICK</option>
        </MokaInput>
    );
});

export default PostSelectRenderer;
