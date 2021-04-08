import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { MokaIcon } from '@components';

/**
 * usedYn === 'Y' 표기
 * value는 field로 넘어온 값을 data에서 찾아서 사용한다
 * @desc color-brand-a4
 * @param {object} params ag grid params
 */
const MokaTableUsedYnThirdRenderer = forwardRef((params, ref) => {
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
            <MokaIcon iconName="fas-circle" fixedWidth className={data[field] === 'Y' ? 'color-brand-a4' : 'color-gray-400'} />
        </div>
    );
});

export default MokaTableUsedYnThirdRenderer;
