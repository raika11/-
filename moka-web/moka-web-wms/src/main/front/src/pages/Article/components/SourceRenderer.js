import React, { forwardRef, useCallback, useImperativeHandle, useRef, useEffect } from 'react';
import { MokaIcon } from '@components';

const SourceRenderer = forwardRef((params, ref) => {
    const ele = useRef(null);

    const drawHeight = useCallback(() => {
        setTimeout(
            function () {
                if (ele.current) {
                    let height = ele.current.offsetHeight;
                    if (height > params.node.rowHeight) {
                        params.node.setRowHeight(height + 2);
                        params.api.onRowHeightChanged();
                    }
                }
            },
            [100],
        );
    }, [params.api, params.node]);

    useImperativeHandle(ref, () => ({
        refresh: () => {
            drawHeight();
            return false;
        },
    }));

    useEffect(() => {
        drawHeight();
    }, [drawHeight]);

    return (
        <div className="ft-12 d-flex align-items-center h-auto" ref={ele}>
            {params.data.bulkflag === 'Y' && <MokaIcon iconName="fas-circle" className="color-info mr-1" />}
            <span>
                {params.data.sourceName} - {params.data.contentKorname}
            </span>
        </div>
    );
});

export default SourceRenderer;
