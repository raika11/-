import React, { useCallback, forwardRef, useImperativeHandle } from 'react';

/**
 * 벌크 모니터링 전송 목록 테이블 상태
 */
const RcvProgsRenderer = forwardRef((props, ref) => {
    const { value, onClick } = props;

    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    const handleClick = useCallback(
        (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (onClick) {
                onClick(value);
            }
        },
        [onClick, value],
    );

    if (Number(value) < 0) {
        return (
            <p className="mb-0 color-primary" onClick={handleClick}>
                실패
            </p>
        );
    } else if (Number(value) >= 10) {
        return (
            <p className="mb-0" onClick={handleClick}>
                완료
            </p>
        );
    } else {
        return (
            <p className="mb-0" onClick={handleClick}>
                진행
            </p>
        );
    }
});

export default RcvProgsRenderer;
