import React, { forwardRef, useImperativeHandle } from 'react';
import { unescapeHtml } from '@utils/convertUtil';

const RunStateDeseRenderer = forwardRef(({ data }, ref) => {
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
            <p className="mb-0">{unescapeHtml(data.route)}</p>
            <p className="mb-0">{unescapeHtml(data.desc)}</p>
        </div>
    );
});

export default RunStateDeseRenderer;
