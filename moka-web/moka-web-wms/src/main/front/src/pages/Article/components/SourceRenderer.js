import React, { forwardRef, useImperativeHandle } from 'react';
import { MokaIcon } from '@components';

const SourceRenderer = forwardRef((params, ref) => {
    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    return (
        <div className="d-flex align-items-center h-auto">
            {params.data.bulkflag === 'Y' && <MokaIcon iconName="fas-circle" className="color-info mr-1" />}
            <span>
                {params.data.sourceName} - {params.data.contentKorname}
            </span>
        </div>
    );
});

export default SourceRenderer;
