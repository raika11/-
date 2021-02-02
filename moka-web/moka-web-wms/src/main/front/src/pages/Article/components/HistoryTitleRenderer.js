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
        <React.Fragment>
            <MokaInput value={unescapeHtmlArticle(data.artTitle)} className="bg-white" disabled />
            <hr className="divider my-1" />
            <MokaInput as="textarea" inputProps={{ rows: 3 }} value={unescapeHtmlArticle(data.artSubTitle)} className="resize-none custom-scroll bg-white" disabled />
        </React.Fragment>
    );
});

export default HistoryTitleRenderer;
