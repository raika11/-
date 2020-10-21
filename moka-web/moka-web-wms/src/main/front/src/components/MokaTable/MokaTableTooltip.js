import React, { forwardRef, useImperativeHandle, useState } from 'react';

/**
 * TODO 스타일 잡아야함 hover한 곳에 생기지 않음
 */
const MokaTableTooltip = forwardRef((props, ref) => {
    const [data] = useState(props.api.getDisplayedRowAtIndex(props.rowIndex).data);
    const [tooltipField] = useState(props.colDef.tooltipField);

    useImperativeHandle(ref, () => {
        return {
            getReactContainerClasses() {
                return ['custom-tooltip'];
            },
        };
    });

    return (
        <div className="moka-tooltip">
            <p>{data[tooltipField]}</p>
        </div>
    );
});

export default MokaTableTooltip;
