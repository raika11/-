import React, { forwardRef } from 'react';
import { MokaIcon } from '@components';

const DropdownToggle = forwardRef(({ onClick, id }, ref) => {
    return (
        <div ref={ref} onClick={onClick} id={id} className="h-100 d-flex align-items-center">
            <MokaIcon iconName="MoreVertical" feather width={16} height={16} />
        </div>
    );
});

export default DropdownToggle;
