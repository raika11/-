import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { MokaInput } from '@components';

/**
 * 단일스위치 Renderer
 */
const MokaTableSwitchRenderer = forwardRef((params, ref) => {
    const field = params.colDef.field;
    const [data, setData] = useState(params.node.data);
    const [value, setValue] = useState(data[field]);

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const val = e.target.checked ? 'Y' : 'N';
        setValue(val);
        params.api.applyTransaction({ update: [{ ...params.node.data, [field]: val }] });

        // 체인지 함수 있으면 실행
        // 체인지 함수명 규칙)
        // field = usedYn 일 때 onChangeUsedYn
        const functionName = `onChange${field.slice(0, 1).toUpperCase()}${field.slice(1)}`;
        if (typeof params.data[functionName] === 'function') {
            params.data[functionName].call(null, params.node.data);
        }
    };

    useImperativeHandle(
        ref,
        () => ({
            refresh: (params) => {
                setData(params.node.data);
                setValue(params.value);
                return true;
            },
        }),
        [],
    );

    return (
        <div className="d-flex align-items-center justify-content-center h-100 w-100">
            <MokaInput
                as="switch"
                id={`switch-${field}-${params.node.id}`}
                inputProps={{
                    custom: true,
                    checked: value === 'Y',
                }}
                onChange={handleChangeValue}
            />
        </div>
    );
});

export default MokaTableSwitchRenderer;
