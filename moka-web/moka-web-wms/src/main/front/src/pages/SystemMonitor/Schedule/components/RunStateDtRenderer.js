import React, { forwardRef, useImperativeHandle } from 'react';

const RunStateDtRenderer = forwardRef(({ data }, ref) => {
    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    return (
        <div className="d-flex flex-column justify-content-center h-100">
            <p className="mb-0">생성 : {data.create}</p>
            <p className="mb-0">배포 : {data.distribute}</p>
        </div>
    );
});

export default RunStateDtRenderer;
