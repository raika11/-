import React from 'react';
import { MokaIcon } from '@components';

const AggridTitleAndSummaryComponent = (params) => {
    const { title, reservation, summary } = params.node.data;

    return (
        <div className="h-100 d-flex flex-column justify-content-center">
            <p className="mb-0 text-truncate" dangerouslySetInnerHTML={{ __html: title }} />
            <div className="d-flex">
                {reservation === true && (
                    <div className="d-flex pr-2">
                        <MokaIcon iconName="fal-alarm-clock" style={{ color: 'FF3907' }} />
                    </div>
                )}
                <div className="d-flex text-truncate">
                    <p className="mb-0 font-weight-bold text-truncate" dangerouslySetInnerHTML={{ __html: summary }} />
                </div>
            </div>
        </div>
    );
};

export default AggridTitleAndSummaryComponent;
