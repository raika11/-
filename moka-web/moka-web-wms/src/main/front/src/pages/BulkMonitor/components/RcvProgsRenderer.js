import React, { useCallback, forwardRef, useImperativeHandle } from 'react';

/**
 * 벌크 모니터링 전송 목록 테이블 상태
 */
const RcvProgsRenderer = forwardRef((props, ref) => {
    const { value, onClick, type, data } = props;

    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    const handleClick = useCallback(
        (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (onClick) {
                onClick(data, type);
            }
        },
        [onClick, data, type],
    );

    return (
        <div className="h-100 d-flex align-items-center justify-content-center">
            <p className={value === '실패' ? 'mb-0 color-primary' : 'mb-0'} onClick={handleClick}>
                {value === '' ? '진행' : value}
            </p>
        </div>
    );
});

export default RcvProgsRenderer;
