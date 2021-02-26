import React, { forwardRef, useImperativeHandle } from 'react';
import clsx from 'clsx';
import { MokaIcon } from '@components';

const SourceRenderer = forwardRef((params, ref) => {
    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    return (
        <div className="d-flex align-items-center h-auto">
            <MokaIcon iconName="fas-circle" className={clsx('mr-1', { 'color-info': params.data.bulkflag === 'Y', 'color-gray-200': params.data.bulkflag !== 'Y' })} />
            <span>
                {params.data.sourceName}
                <br />
                {params.data.contentKorname}
            </span>
        </div>
    );
});

export default SourceRenderer;
