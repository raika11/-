import React, { forwardRef, useImperativeHandle } from 'react';

/**
 * 삭제 정보
 */
const WorkDelRenderer = forwardRef(({ data }, ref) => {
    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    return (
        <div className="d-flex h-100">
            <p className="mb-0">{data.delDt}</p>
            <p className="mb-0">{data.delAdmin}</p>
        </div>
    );
});

export default WorkDelRenderer;
