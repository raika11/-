import React, { useEffect, forwardRef } from 'react';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import ReporterDeskSearch from './ReporterDeskSearch';
import ReporterDeskAgGrid from './ReporterDeskAgGrid';
import { clearStore } from '@store/reporter';

/**
 * 페이지편집 > 기자 목록
 */
const ReporterList = forwardRef((props, ref) => {
    const { className, selectedComponent, dropTargetAgGrid, onDragStop, show } = props;
    const dispatch = useDispatch();

    useEffect(() => {
        if (!show) {
            dispatch(clearStore());
        }
    }, [dispatch, show]);

    return (
        <div className={clsx('d-flex flex-column h-100 py-3 px-card', className)}>
            <ReporterDeskSearch selectedComponent={selectedComponent} show={show} />
            <ReporterDeskAgGrid ref={ref} dropTargetAgGrid={dropTargetAgGrid} onDragStop={onDragStop} />
        </div>
    );
});

export default ReporterList;
