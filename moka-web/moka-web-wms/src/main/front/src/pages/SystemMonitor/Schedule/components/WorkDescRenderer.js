import React, { forwardRef, useImperativeHandle } from 'react';
import { unescapeHtml } from '@utils/convertUtil';

/**
 * 테이블 URL, 배포 경로, 설명
 */
const WorkDescRenderer = forwardRef(({ data }, ref) => {
    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    return (
        <div className="d-flex flex-column justify-content-center h-100">
            <div>
                <a target="_blank" className="mb-0 ft-12" rel="noopener noreferrer" href={data.totalId}>
                    {data.url}
                </a>
            </div>
            <p className="mb-0 color-secondary">{unescapeHtml(data.route)}</p>
            <p className="mb-0 color-success">{unescapeHtml(data.desc)}</p>
        </div>
    );
});

export default WorkDescRenderer;
