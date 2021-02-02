import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { MokaInput } from '@components';

/**
 * 카테고리 제목 수정
 */
const CategoryEditorRenderer = forwardRef((params, ref) => {
    const field = params.colDef.field;
    const data = params.node.data;
    const [name, setName] = useState(data[field]);

    useImperativeHandle(
        ref,
        () => ({
            refresh: () => true,
            setValue: (catNm) => setName(catNm),
            getValue: () => name,
        }),
        [name],
    );

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        setName(e.target.value);
    };

    /**
     * onBlur
     */
    const handleBlur = (e) => {
        params.setValue(e.target.value);
        params.api.applyTransaction({ update: [{ ...data, [field]: e.target.value }] });
    };

    return (
        <div className="h-100 d-flex align-items-center justify-content-center">
            <MokaInput value={name} onChange={handleChangeValue} onBlur={handleBlur} />
        </div>
    );
});

export default CategoryEditorRenderer;
