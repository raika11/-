import React, { forwardRef } from 'react';
import clsx from 'clsx';
import ColumnistDeskSearch from './ColumnistDeskSearch';
import ColumnistDeskAgGrid from './ColumnistDeskAgGrid';

const ColumnistDeskList = forwardRef((props, ref) => {
    const { className, selectedComponent, dropTargetAgGrid, onDragStop, show } = props;

    return (
        <div className={clsx('d-flex flex-column h-100 py-3 px-card', className)}>
            <ColumnistDeskSearch selectedComponent={selectedComponent} show={show} />
            <ColumnistDeskAgGrid ref={ref} dropTargetAgGrid={dropTargetAgGrid} onDragStop={onDragStop} />
        </div>
    );
});

export default ColumnistDeskList;
