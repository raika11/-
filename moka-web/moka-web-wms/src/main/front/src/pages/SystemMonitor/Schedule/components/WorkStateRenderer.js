import React, { forwardRef, useImperativeHandle } from 'react';
import moment from 'moment';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { DB_DATEFORMAT } from '@/constants';

/**
 * 테이블 등록 수정 정보
 */
const WorkStateRenderer = forwardRef(({ data }, ref) => {
    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    return (
        <OverlayTrigger
            overlay={
                <Tooltip id="tooltip-table-edit-info">
                    {data.regMember && <p className="mb-0">{`등록 ${moment(data.regDt).format(DB_DATEFORMAT)} ${data.regMember.memberNm}(${data.regMember.memberId})`}</p>}
                    {data.modMember && <p className="mb-0">{`수정 ${moment(data.modDt).format(DB_DATEFORMAT)} ${data.modMember.memberNm}(${data.modMember.memberId})`}</p>}
                </Tooltip>
            }
        >
            <div className="d-flex flex-column justify-content-center h-100">
                {data.regMember && <p className="mb-0">{`등록 ${moment(data.regDt).format(DB_DATEFORMAT)} ${data.regMember.memberNm}(${data.regMember.memberId})`}</p>}
                {data.modMember && <p className="mb-0">{`수정 ${moment(data.modDt).format(DB_DATEFORMAT)} ${data.modMember.memberNm}(${data.modMember.memberId})`}</p>}
            </div>
        </OverlayTrigger>
    );
});

export default WorkStateRenderer;
