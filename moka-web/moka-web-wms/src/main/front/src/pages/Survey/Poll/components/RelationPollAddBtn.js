import React, { useImperativeHandle, forwardRef } from 'react';
import Button from 'react-bootstrap/Button';

const RelationPollAddBtn = forwardRef((params, ref) => {
    useImperativeHandle(ref, () => ({
        refresh: () => true,
    }));

    return (
        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
            <Button
                variant="outline-table-btn"
                onClick={() => {
                    const data = params.node.data;
                    if (data.onAdd instanceof Function) {
                        const { onAdd, ...rest } = data;
                        onAdd(rest);
                    }
                }}
                size="sm"
            >
                등록
            </Button>
        </div>
    );
});

export default RelationPollAddBtn;
