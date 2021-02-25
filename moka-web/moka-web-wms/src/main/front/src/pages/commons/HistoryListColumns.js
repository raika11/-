import React from 'react';
import { MokaTableLoadButton } from '@components';

export default [
    {
        headerName: 'No',
        field: 'seq',
        width: 65,
        tooltipField: 'seq',
    },
    {
        headerName: '작업일시',
        field: 'regDt',
        width: 140,
    },
    {
        headerName: '작업자',
        field: 'regId',
        width: 100,
        tooltipField: 'regId',
        flex: 1,
    },
    {
        headerName: '불러오기',
        field: 'load',
        width: 62,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableLoadButton {...row} onClick={data.handleClickLoad} />;
        },
    },
];
