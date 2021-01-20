import React, { forwardRef, useImperativeHandle } from 'react';

const RunStateErrorRenderer = forwardRef(({ data }, ref) => {
    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    return (
        <div className="d-flex flex-column justify-content-center h-100">
            <p className="mb-0">{data.lastDt}</p>
            <p className="mb-0">{data.error}</p>
        </div>
    );
});

export default RunStateErrorRenderer;
