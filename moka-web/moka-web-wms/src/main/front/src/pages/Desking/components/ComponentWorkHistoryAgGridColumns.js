import React from 'react';
import { MokaTableLoadButton } from '@components';
import { HIST_PUBLISH } from '@/constants';

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
        cellStyle: (row) => {
            const { data } = row;
            return data.approvalYn === 'N' && data.status === HIST_PUBLISH ? { fontSize: '12px', color: 'red' } : { fontSize: '12px' };
        },
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
        width: 92,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableLoadButton {...row} onClick={data.handleClickLoad} />;
        },
    },
];
