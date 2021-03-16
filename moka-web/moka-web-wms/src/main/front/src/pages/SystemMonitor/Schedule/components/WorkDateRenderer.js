import React, { forwardRef, useImperativeHandle } from 'react';

/**
 * 테이블 생성, 배포 일시
 */
const WorkDateRenterer = forwardRef(({ data }, ref) => {
    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    return (
        <div className="d-flex flex-column justify-content-center h-100">
            {data.jobStatus && (
                <>
                    <p className="mb-0">{`생성 : ${data.jobStatus.genResult}/${data.jobStatus.genExecTime}`}</p>
                    <p className="mb-0">{`배포 : ${data.jobStatus.sendResult}/${data.jobStatus.sendExecTime}`}</p>
                </>
            )}
        </div>
    );
});

export default WorkDateRenterer;
