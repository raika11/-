import React, { forwardRef, useImperativeHandle } from 'react';

/**
 * IP / HOST
 */
const WorkIpHostRenterer = forwardRef(({ data }, ref) => {
    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    return (
        <div className="h-100">
            <p className="mb-0">{data.ip ? data.ip : data.host}</p>
        </div>
    );
});

export default WorkIpHostRenterer;
