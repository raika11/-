import React from 'react';
import { MokaInput } from '@/components';

/**
 * 시민 마이크 AgGrid 스위치
 */
const MicTableSwitch = (props) => {
    const { data, id } = props;

    return (
        <>
            <MokaInput
                as="switch"
                id={`switch-${id}`}
                inputProps={{
                    custom: true,
                    checked: data === 'Y',
                }}
                onChange={(e) => {
                    if (e.target.checked) {
                        return 'Y';
                    } else {
                        return 'N';
                    }
                }}
            />
        </>
    );
};

export default MicTableSwitch;
