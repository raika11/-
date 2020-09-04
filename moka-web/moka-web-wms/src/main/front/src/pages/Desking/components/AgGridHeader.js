/* eslint-disable react/jsx-closing-tag-location */
import React from 'react';
import clsx from 'clsx';

const AgGridHeader = (props) => {
    const { headers } = props;

    const onSortChanged = (info, sort, event, idx) => {
        if (typeof info.onSortChange === 'function') {
            info.onSortChange(sort, event, idx);
        }
    };

    return (
        <>
            {headers.map((info, idx) => (
                <div className="ag-cell-label-container" key={idx}>
                    <div className="ag-header-cell-label" role="presentation" unselectable="on">
                        <span className="ag-header-cell-text" role="columnheader">
                            {info.name}
                        </span>
                        {info.sortable && (
                            <>
                                {/* <span
                                    className={clsx(
                                        'ag-header-icon ag-header-label-icon ag-filter-icon',
                                        { 'ag-hidden': filter }
                                    )}
                                    aria-hidden="true"
                                >
                                    <span
                                        className="ag-icon ag-icon-filter"
                                        unselectable="on"
                                    ></span>
                                </span> */}
                                {/* <span
                                    className="ag-header-icon ag-header-label-icon ag-sort-order ag-hidden"
                                    aria-hidden="true"
                                >
                                    1
                                </span> */}
                                <span
                                    // ref="eSortAsc"
                                    className={clsx(
                                        'ag-header-icon ag-header-label-icon ag-sort-ascending-icon',
                                        { 'ag-hidden': info.sort !== 'asc' }
                                    )}
                                    onClick={(e) => onSortChanged(info, 'desc', e, idx)}
                                    onTouchEnd={(e) => onSortChanged(info, 'desc', e, idx)}
                                    aria-hidden="true"
                                >
                                    <span className="ag-icon ag-icon-asc" unselectable="on"></span>
                                </span>
                                <span
                                    // ref="eSortDesc"
                                    className={clsx(
                                        'ag-header-icon ag-header-label-icon ag-sort-descending-icon',
                                        { 'ag-hidden': info.sort !== 'desc' }
                                    )}
                                    onClick={(e) => onSortChanged(info, 'noSort', e, idx)}
                                    onTouchEnd={(e) => onSortChanged(info, 'noSort', e, idx)}
                                    aria-hidden="true"
                                >
                                    <span className="ag-icon ag-icon-desc" unselectable="on"></span>
                                </span>
                                <span
                                    // ref="eSortNone"
                                    className={clsx(
                                        'ag-header-icon ag-header-label-icon ag-sort-none-icon',
                                        {
                                            'ag-hidden': info.sort === 'asc' || info.sort === 'desc'
                                        }
                                    )}
                                    onClick={(e) => onSortChanged(info, 'asc', e, idx)}
                                    onTouchEnd={(e) => onSortChanged(info, 'asc', e, idx)}
                                    aria-hidden="true"
                                >
                                    <span className="ag-icon ag-icon-none" unselectable="on"></span>
                                </span>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </>
    );
};

export default AgGridHeader;
