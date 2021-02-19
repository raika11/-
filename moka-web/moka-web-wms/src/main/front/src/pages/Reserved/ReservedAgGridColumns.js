import React from 'react';
import { MokaTableDeleteButton } from '@components';

export const columnDefs = [
    {
        headerName: '예약어',
        field: 'reservedId',
        width: 120,
        tooltipField: 'reservedId',
    },
    {
        headerName: '값',
        field: 'reservedValue',
        flex: 1,
        width: 145,
        tooltipField: 'reservedValue',
    },
    {
        headerName: '사용여부',
        field: 'usedYn',
        width: 65,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '',
        field: 'delete',
        width: 28,
        maxWidth: 28,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableDeleteButton {...row} onClick={data.onDelete} />;
        },
    },
];
