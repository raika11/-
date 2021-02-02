import React, { forwardRef, useImperativeHandle } from 'react';
import { unescapeHtmlArticle } from '@utils/convertUtil';

const TitleRenderer = forwardRef(({ data }, ref) => {
    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    return (
        <div className="d-flex flex-column justify-content-center h-100">
            <p className="mb-0 text-truncate">{unescapeHtmlArticle(data.title)}</p>
            <div>
                <a target="_blank" className="mb-0 ft-12" rel="noopener noreferrer" href={data.cdnUrlNews}>
                    {data.cdnUrlNews}
                </a>
            </div>
            <div>
                <a target="_blank" className="mb-0 ft-12" rel="noopener noreferrer" href={data.cdnUrlMnews}>
                    {data.cdnUrlMnews}
                </a>
            </div>
        </div>
    );
});

export default TitleRenderer;
