import React from 'react';
import { MokaTableLoadButton } from '@components';

export default [
    {
        headerName: 'ID',
        field: 'seq',
        width: 70,
        tooltipField: 'seq',
    },
    {
        headerName: '작업일시',
        field: 'regDt',
        width: 156,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '작업자',
        field: 'regId',
        width: 100,
        tooltipField: 'regId',
    },
    {
        headerName: '',
        field: 'load',
        width: 36,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableLoadButton {...row} onClick={data.handleClickLoad} />;
        },
    },
];
