import React, { forwardRef, useImperativeHandle } from 'react';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';

/**
 * 삭제 정보
 */
const WorkDelRenderer = forwardRef(({ data }, ref) => {
    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    return (
        <div className="h-100 d-flex align-items-center">
            {data.modDt && (
                <>
                    <p className="mb-0 mr-1">{moment(data.modDt).format(DB_DATEFORMAT)}</p>
                    <p className="mb-0">{data.modMember ? `${data.modMember.memberNm}(${data.modMember.memberId})` : ''}</p>
                </>
            )}
        </div>
    );
});

export default WorkDelRenderer;
