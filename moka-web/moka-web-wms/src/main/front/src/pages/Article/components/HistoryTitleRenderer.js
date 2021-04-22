import React, { forwardRef, useImperativeHandle } from 'react';
import { MokaInput } from '@components';
import { unescapeHtmlArticle } from '@utils/convertUtil';

/**
 * 히스토리 모달의 타이틀
 */
const HistoryTitleRenderer = forwardRef((props, ref) => {
    const { data } = props;

    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    return (
        <div className="h-100 d-flex flex-column justify-content-center">
            <MokaInput value={unescapeHtmlArticle(data.artTitle)} className="bg-white mb-1 flex-grow-0" disabled />
            <MokaInput as="textarea" inputProps={{ rows: 3 }} value={unescapeHtmlArticle(data.artSubTitle)} className="bg-white" disabled />
        </div>
    );
});

export default HistoryTitleRenderer;
