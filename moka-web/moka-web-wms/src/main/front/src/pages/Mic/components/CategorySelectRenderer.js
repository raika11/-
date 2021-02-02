import React, { forwardRef, useState, useImperativeHandle } from 'react';
import { MokaInput } from '@/components';

/**
 * 시민 마이크 카테고리 모달 AgGrid 셀렉트
 */
const CategorySelectRenderer = forwardRef((params, ref) => {
    const field = params.colDef.field;
    const data = params.node.data;
    const [usedYn, setUsedYn] = useState(data[field]);

    useImperativeHandle(
        ref,
        () => ({
            refresh: () => true,
            setValue: (usedYn) => setUsedYn(usedYn),
            getValue: () => usedYn,
        }),
        [usedYn],
    );

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        params.setValue(e.target.value);
        setUsedYn(e.target.value);
        params.api.applyTransaction({ update: [{ ...data, [field]: e.target.value }] });
    };

    return (
        <div className="h-100 d-flex align-items-center justify-content-center">
            <MokaInput as="select" value={usedYn} onChange={handleChangeValue}>
                <option value="Y">사용</option>
                <option value="N">사용안함</option>
            </MokaInput>
        </div>
    );
});

export default CategorySelectRenderer;
