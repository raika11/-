import React, { useRef, useEffect } from 'react';
import { MokaIcon } from '@components';

const SourceRenderer = (params) => {
    const ele = useRef(null);

    useEffect(() => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    return (
        <div className="ft-12 d-flex align-items-center h-100" ref={ele}>
            {params.data.bulkFlag === 'Y' && <MokaIcon iconName="fas-circle" className="color-info mr-1" />}
            {params.data.sourceName} - {params.data.contentKorname}
        </div>
    );
};

export default SourceRenderer;
