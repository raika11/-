import React, { forwardRef, useImperativeHandle } from 'react';

/**
 * 테이블 등록 수정 정보
 */
const WorkStateRenderer = forwardRef(({ data }, ref) => {
    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    return (
        <div className="d-flex flex-column justify-content-center h-100">
            <p className="mb-0">
                등록 {data.regDt} {data.regAdmin}
            </p>
            {data.modDt && data.modAdmin && (
                <p className="mb-0">
                    수정 {data.modDt} {data.modAdmin}
                </p>
            )}
        </div>
    );
});

export default WorkStateRenderer;
