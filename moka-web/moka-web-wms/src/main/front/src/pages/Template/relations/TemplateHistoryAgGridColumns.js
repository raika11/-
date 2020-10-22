import React from 'react';
import { MokaTableLoadButton } from '@components';

export default [
    {
        headerName: 'ID',
        field: 'seq',
        width: 50,
        // cellClass: 'ag-cell-center',
        // cellStyle: { textAlign: 'center' },
    },
    {
        headerName: '작업일시',
        field: 'regDt',
        width: 100,
    },
    {
        headerName: '작업자',
        field: 'regId',
        width: 100,
    },
    {
        headerName: '',
        field: 'load',
        width: 36,
        cellRendererFramework: (row) => <MokaTableLoadButton {...row} />,
    },
];
