import React, { forwardRef } from 'react';
import { MokaIcon } from '@components';

const DropdownToggle = forwardRef(({ onClick, id }, ref) => {
    return (
        <div ref={ref} className="px-2" onClick={onClick} id={id}>
            <MokaIcon iconName="fal-ellipsis-v-alt" />
        </div>
    );
});

export default DropdownToggle;
