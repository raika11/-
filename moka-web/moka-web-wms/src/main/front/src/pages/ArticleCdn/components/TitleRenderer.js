import React, { forwardRef, useImperativeHandle } from 'react';
import { unescapeHtml } from '@utils/convertUtil';
import { ARTICLE_URL, MOBILE_ARTICLE_URL } from '@/constants';

const TitleRenderer = forwardRef(({ data }, ref) => {
    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    return (
        <div className="d-flex flex-column justify-content-center h-100">
            <p className="mb-0">{unescapeHtml(data.artTitle)}</p>
            <div>
                <a target="_blank" className="mb-0 ft-12" rel="noopener noreferrer" href={`${ARTICLE_URL}${data.totalId}`}>
                    {`${ARTICLE_URL}${data.totalId}`}
                </a>
            </div>
            <div>
                <a target="_blank" className="mb-0 ft-12" rel="noopener noreferrer" href={`${MOBILE_ARTICLE_URL}${data.totalId}`}>
                    {`${MOBILE_ARTICLE_URL}${data.totalId}`}
                </a>
            </div>
        </div>
    );
});

export default TitleRenderer;
