import React from 'react';

/**
 * 테이블 URL, 배포 경로, 설명
 */
const WorkDescRenderer = ({ data }) => {
    return (
        <div className="d-flex flex-column justify-content-center h-100">
            <p className="mb-0">{data.pkgNm}</p>
            <p className="mb-0 color-secondary">{data.targetPath}</p>
            <p className="mb-0 color-success">{data.jobDesc}</p>
        </div>
    );
};

export default WorkDescRenderer;
