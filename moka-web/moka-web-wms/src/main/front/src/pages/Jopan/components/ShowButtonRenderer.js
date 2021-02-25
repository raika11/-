import React, { useCallback, forwardRef, useImperativeHandle } from 'react';
import Button from 'react-bootstrap/Button';

/**
 * 조판 테이블 보기 버튼
 */
const ShowButtonRenderer = forwardRef((props, ref) => {
    const { onClick } = props;

    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    return (
        <div className="h-100 d-flex align-items-center">
            <Button size="sm" variant="outline-table-btn" onClick={onClick}>
                보기
            </Button>
        </div>
    );
});

export default ShowButtonRenderer;
