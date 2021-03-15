import React, { forwardRef, useImperativeHandle } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const WorkStatisticRenderer = forwardRef((props, ref) => {
    const { stateA, stateB } = props;

    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    return (
        <OverlayTrigger overlay={<Tooltip id="tooltip-table-statistic-info">{`${stateA}개, ${stateB}초`}</Tooltip>}>
            <div className="h-100">
                <p className="mb-0 text-truncate">{`${stateA}개, ${stateB}초`}</p>;
            </div>
        </OverlayTrigger>
    );
});

export default WorkStatisticRenderer;
