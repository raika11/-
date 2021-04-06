import React, { useState, forwardRef, useImperativeHandle } from 'react';
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

    return (
        <div className="d-flex align-items-center justify-content-center h-100">
            <MokaIcon iconName="fas-circle" fixedWidth className={data[field] === 'Y' ? 'color-neutral' : 'color-gray-400'} />
        </div>
    );
});

export default StatusRenderer;
