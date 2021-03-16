import React, { forwardRef, useImperativeHandle } from 'react';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

/**
 * 테이블 URL, 배포 경로, 설명
 */
const WorkDescRenderer = forwardRef(({ data }, ref) => {
    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    return (
        <OverlayTrigger
            overlay={
                <Tooltip id="tooltip-table-edit-info">
                    <p className="mb-0">{data.pkgNm && '패키지명 : ' + data.pkgNm}</p>
                    <p className="mb-0">{data.targetPath && '배포 경로 : ' + data.targetPath}</p>
                    <p className="mb-0">{data.jobDesc && '설명 : ' + data.jobDesc}</p>
                </Tooltip>
            }
        >
            <div className="d-flex flex-column justify-content-center h-100">
                <p className="mb-0 text-truncate">{data.pkgNm}</p>
                <p className="mb-0 color-secondary text-truncate">{data.targetPath}</p>
                <p className="mb-0 color-success text-truncate">{data.jobDesc}</p>
            </div>
        </OverlayTrigger>
    );
});

export default WorkDescRenderer;
