import React, { forwardRef, useImperativeHandle } from 'react';

const SourceRenderer = forwardRef((params, ref) => {
    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    return (
        <div className="d-flex align-items-center h-auto">
            <span>
                {params.data.sourceName}
                <br />
                {params.data.contentKorname}
            </span>
        </div>
    );
});

export default SourceRenderer;
