import React from 'react';
import ReservedListDeleteButton from './ReservedListDeleteButton';

/**
 * 목록에서 줄 높이
 */
// export const rowHeight = 51; // 두 줄
export const rowHeight = 32;

/**
 * 목록 이외의 높이
 */
export const otherHeight = 130;

export const reservedColumns = [
    {
        id: 'reservedId',
        format: '',
        sort: false,
        disablePadding: true,
        label: '예약어',
        width: 126,
        align: 'center'
    },
    {
        id: 'reservedValue',
        format: '',
        sort: false,
        disablePadding: true,
        label: '값',
        width: 200,
        align: 'left'
    },
    {
        id: 'reservedDelete',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '',
        width: 58,
        align: 'center',
        component: (row) => <ReservedListDeleteButton row={row} />
    }
];

export default reservedColumns;
