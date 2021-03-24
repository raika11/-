import React, { useImperativeHandle, useState, forwardRef } from 'react';
import Button from 'react-bootstrap/Button';

/**
 * Button Renderer
 */
const MokaTableButton = forwardRef((params, ref) => {
    const [field] = useState(params.colDef.field);

    useImperativeHandle(ref, () => ({
        refresh: (params) => {
            return true;
        },
    }));

    return (
        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
            <Button
                variant="outline-table-btn"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (params.node.data.onClick) {
                        params.node.data.onClick(params.node.data);
                    }
                }}
                size="sm"
            >
                {field === 'add' ? '등록' : field}
            </Button>
        </div>
    );
});

export default MokaTableButton;
