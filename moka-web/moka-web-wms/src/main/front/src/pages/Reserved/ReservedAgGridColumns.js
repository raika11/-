import React from 'react';
import { MokaTableDeleteButton } from '@components';

export const columnDefs = [
    {
        headerName: '예약어',
        field: 'reservedId',
        width: 120,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '값',
        field: 'reservedValue',
        flex: 1,
        width: 202,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '',
        field: 'delete',
        width: 36,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableDeleteButton {...row} onClick={data.onDelete} />;
        },
    },
];
