import React from 'react';
import { MokaTableLoadButton } from '@components';

export default [
    {
        headerName: 'No',
        field: 'seq',
        width: 50,
        tooltipField: 'seq',
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '작업일시',
        field: 'regDt',
        width: 200,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '작업자',
        field: 'regId',
        width: 90,
        tooltipField: 'regId',
    },
    {
        headerName: '불러오기',
        field: 'load',
        width: 70,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableLoadButton {...row} onClick={data.handleClickLoad} />;
        },
    },
];
