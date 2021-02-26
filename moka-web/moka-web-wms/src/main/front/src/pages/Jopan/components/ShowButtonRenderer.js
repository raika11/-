import React, { useCallback, forwardRef, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { closeSidebar } from '@/store/layout';

/**
 * 조판 테이블 보기 버튼
 */
const ShowButtonRenderer = forwardRef((props, ref) => {
    const { onClick } = props;
    const dispatch = useDispatch();
    const layout = useSelector((store) => store.layout);

    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    const handleClick = useCallback(
        (e) => {
            e.stopPropagation();
            e.preventDefault();

            if (onClick) {
                if (layout.sidebarIsOpen) {
                    dispatch(closeSidebar());
                }
                onClick();
            }
        },
        [dispatch, layout.sidebarIsOpen, onClick],
    );

    return (
        <div className="h-100 d-flex align-items-center">
            <Button size="sm" variant="outline-table-btn" onClick={handleClick}>
                보기
            </Button>
        </div>
    );
});

export default ShowButtonRenderer;
