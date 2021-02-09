import React, { useCallback, forwardRef, useImperativeHandle } from 'react';
import Button from 'react-bootstrap/Button';

/**
 * 벌크 모니터링 테이블 벌크 로그 상세 버튼
 */
const RcvProgsBulkLogBtnRenderer = forwardRef((props, ref) => {
    const { data, onClick } = props;

    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    const handleClick = useCallback(
        (e) => {
            e.stopPropagation();
            e.preventDefault();

            if (onClick) {
                onClick(data);
            }
        },
        [data, onClick],
    );
    return (
        <Button variant="outline-table-btn" size="sm" onClick={handleClick}>
            상세
        </Button>
    );
});

export default RcvProgsBulkLogBtnRenderer;
