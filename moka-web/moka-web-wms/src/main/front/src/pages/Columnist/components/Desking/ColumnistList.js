import React, { useEffect, forwardRef } from 'react';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import ColumnistDeskSearch from './ColumnistDeskSearch';
import ColumnistDeskAgGrid from './ColumnistDeskAgGrid';
import { clearStore } from '@store/columnist';

const ColumnistList = forwardRef((props, ref) => {
    const { className, selectedComponent, dropTargetAgGrid, onDragStop, show } = props;
    const dispatch = useDispatch();

    useEffect(() => {
        if (!show) {
            dispatch(clearStore());
        }
    }, [dispatch, show]);

    return (
        <div className={clsx('d-flex flex-column h-100 py-3 px-card', className)}>
            <ColumnistDeskSearch selectedComponent={selectedComponent} show={show} />
            <ColumnistDeskAgGrid ref={ref} dropTargetAgGrid={dropTargetAgGrid} onDragStop={onDragStop} />
        </div>
    );
});

export default ColumnistList;
