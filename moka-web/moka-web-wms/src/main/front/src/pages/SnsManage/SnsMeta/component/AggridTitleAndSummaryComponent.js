import React from 'react';
import { MokaIcon } from '@components';

const AggridTitleAndSummaryComponent = ({ title, summary, reservation }) => {
    return (
        <div className="h-100">
            <div className="d-flex">
                <p className="mb-0 flex-fill text-truncate" dangerouslySetInnerHTML={{ __html: title }} />
            </div>
            <div className="d-flex">
                {reservation === true && (
                    <div className="d-flex pr-2">
                        <MokaIcon iconName="fal-alarm-clock" style={{ color: 'FF3907' }} />
                    </div>
                )}
                <div className="d-flex text-truncate">
                    <p className="mb-0 flex-fill h5 text-truncate" dangerouslySetInnerHTML={{ __html: summary }} />
                </div>
            </div>
        </div>
    );
};

export default AggridTitleAndSummaryComponent;
