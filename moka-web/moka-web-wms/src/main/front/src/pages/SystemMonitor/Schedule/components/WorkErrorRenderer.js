import React, { forwardRef, useImperativeHandle } from 'react';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';

/**
 * 테이블 작업 에러
 */
const WorkErrorRenderer = forwardRef(({ data }, ref) => {
    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    return (
        <div className="d-flex flex-column justify-content-center h-100">
            {data.jobStatus && (
                <>
                    <p className="mb-0">{moment(data.jobStatus.lastExecDt).format(DB_DATEFORMAT)}</p>
                    <p className="mb-0">{data.jobStatus.errMgs}</p>
                </>
            )}
        </div>
    );
});

export default WorkErrorRenderer;
