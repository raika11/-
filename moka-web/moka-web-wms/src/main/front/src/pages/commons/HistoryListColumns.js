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
        width: 150,
    },
    {
        headerName: '작업자',
        field: 'regId',
        width: 90,
        flex: 1,
    },
    {
        headerName: '',
        field: 'load',
        width: 33,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableLoadButton {...row} onClick={data.handleClickLoad} />;
        },
    },
];
