import React, { forwardRef, useImperativeHandle } from 'react';
import { MokaIcon } from '@components';

const AggridTitleAndSummaryComponent = forwardRef((params, ref) => {
    const { title, reservation, summary } = params.node.data;

    useImperativeHandle(
        ref,
        () => ({
            refresh: () => true,
        }),
        [],
    );

    return (
        <div className="h-100 d-flex flex-column justify-content-center">
            <p className="mb-0 flex-fill text-truncate" dangerouslySetInnerHTML={{ __html: title }} style={{ lineHeight: 'normal' }} />
            <div className="d-flex">
                {reservation === true && (
                    <div className="d-flex pr-2">
                        <MokaIcon iconName="fal-alarm-clock" style={{ color: 'FF3907' }} />
                    </div>
                )}
                <div className="d-flex text-truncate">
                    <p className="mb-0 flex-fill font-weight-bold text-truncate" dangerouslySetInnerHTML={{ __html: summary }} style={{ lineHeight: 'normal' }} />
                </div>
            </div>
        </div>
    );
});

export default AggridTitleAndSummaryComponent;
