import React from 'react';
import { MokaIcon } from '@components';

// fal-alarm-clock

const ListTitleRenderer = ({ title, summary, reservation }) => {
    return (
        <>
            <div className="pt-01" style={{ minHeight: 55, textAlign: 'left' }}>
                <div className="d-flex">
                    <p className="pt-01 pl-01 mb-0 flex-fill text-truncate" dangerouslySetInnerHTML={{ __html: title }} />
                </div>
                <div className="d-flex">
                    {reservation === true && (
                        <div className="d-flex pr-2">
                            <MokaIcon iconName="fal-alarm-clock" style={{ color: 'FF3907' }} />
                        </div>
                    )}
                    <div className="d-flex text-truncate">
                        <p className="pt-01 pl-02 mb-0 flex-fill h5 text-truncate" dangerouslySetInnerHTML={{ __html: summary }} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ListTitleRenderer;
