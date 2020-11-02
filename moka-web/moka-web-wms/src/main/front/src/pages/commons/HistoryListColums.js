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
        width: 155,
    },
    {
        headerName: '작업자',
        field: 'regId',
        width: 99,
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
