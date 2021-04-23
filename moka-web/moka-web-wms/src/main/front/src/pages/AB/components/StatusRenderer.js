import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { MokaIcon } from '@components';

/**
 * AB 테스트 상태 마크 렌더링
 */
const StatusRenderer = forwardRef((params, ref) => {
    const { data: initialData, colDef } = params;
    const [field] = useState(colDef.field);
    const [data, setData] = useState(initialData);

    useImperativeHandle(ref, () => ({
        refresh: (params) => {
            if (params.data[field] !== data[field]) {
                setData(params.data);
            }
            return false;
        },
    }));

    //상태(임시T/진행Y/대기P/종료Q)
    const getClassName = (status) => {
        let clazzName = 'color-gray-400';
        switch (status) {
            case 'Q':
                clazzName = 'color-searching';
                break;
            case 'Y':
                clazzName = 'color-brand-a6';
                break;
            case 'P':
                clazzName = 'color-neutral';
                break;
            default:
                break;
        }

        return clazzName;
    };

    return (
        <div className="d-flex align-items-center justify-content-center h-100">
            <MokaIcon iconName="fas-circle" fixedWidth className={getClassName(data[field])} />
        </div>
    );
});

export default StatusRenderer;
