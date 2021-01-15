import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { MokaInput } from '@/components';

/**
 * 시민 마이크 AgGrid 스위치
 */
const MicTableSwitch = forwardRef((params, ref) => {
    const { colDef } = params;
    const [value, setValue] = useState('');

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

    useEffect(() => {
        if (params) {
            setValue(params.value);
        }
    }, [params]);

    return (
        <MokaInput
            as="switch"
            id={`micAgGrid-switch-${params.colDef.field}-${params.data.seqNo}`}
            inputProps={{
                custom: true,
                checked: value === 'Y',
            }}
            onChange={(e) => {
                if (e.target.checked) {
                    setValue('Y');
                } else {
                    setValue('N');
                }
            }}
        />
    );
});

export default MicTableSwitch;
