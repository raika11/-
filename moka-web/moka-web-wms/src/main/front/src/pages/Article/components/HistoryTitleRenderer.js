import React, { forwardRef, useImperativeHandle } from 'react';
import { MokaInput } from '@components';

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
            <MokaInput value={data.artTitle} inputProps={{ plaintext: true }} />
            <hr className="divider mt-1 mb-2" />
            <MokaInput as="textarea" inputProps={{ rows: 3 }} value={(data.artSubTitle || '').replaceAll('<br/>', '\n')} className="resize-none custom-scroll" disabled />
        </React.Fragment>
    );
});

export default HistoryTitleRenderer;
