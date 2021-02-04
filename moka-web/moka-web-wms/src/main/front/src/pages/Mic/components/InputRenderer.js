import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { MokaInput } from '@components';

/**
 * input 1개짜리
 */
const InputRenderer = forwardRef((params, ref) => {
    const field = params.colDef.field;
    const data = params.node.data;
    const [value, setValue] = useState(data[field]);

    useImperativeHandle(
        ref,
        () => ({
            refresh: (params) => {
                setValue(params.value);
                return true;
            },
            setValue: (value) => setValue(value),
            getValue: () => value,
        }),
        [value],
    );

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        setValue(e.target.value);
    };

    /**
     * onBlur
     */
    const handleBlur = (e) => {
        // params.setValue(e.target.value);
        params.api.applyTransaction({ update: [{ ...params.node.data, [field]: e.target.value }] });
    };

    return (
        <div className="h-100 d-flex align-items-center justify-content-center">
            <MokaInput value={value} onChange={handleChangeValue} onBlur={handleBlur} />
        </div>
    );
});

export default InputRenderer;
