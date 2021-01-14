import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { MokaInput } from '@/components';

/**
 * 시민 마이크 카테고리 모달 AgGrid 셀렉트
 */
const CategorySelectRenderer = forwardRef((params, ref) => {
    const field = params.colDef.field;
    const data = params.data;
    const [used, setUsed] = useState('');

    useImperativeHandle(
        ref,
        () => ({
            refresh: () => {
                return false;
            },
        }),
        [],
    );

    useEffect(() => {
        if (data && field) {
            setUsed(data[field]);
        }
    }, [data, field]);

    return (
        <MokaInput
            as="select"
            className="ft-12"
            value={used}
            onChange={(e) => {
                setUsed(e.target.value);
                params.setValue(e.target.value);
            }}
        >
            <option value="Y">사용</option>
            <option value="N">사용안함</option>
        </MokaInput>
    );
});

export default CategorySelectRenderer;
