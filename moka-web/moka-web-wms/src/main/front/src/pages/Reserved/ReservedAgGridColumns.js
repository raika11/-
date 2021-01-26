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
        width: 202,
        tooltipField: 'reservedValue',
    },
    {
        headerName: '',
        field: 'delete',
        width: 33,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableDeleteButton {...row} onClick={data.onDelete} />;
        },
    },
];
