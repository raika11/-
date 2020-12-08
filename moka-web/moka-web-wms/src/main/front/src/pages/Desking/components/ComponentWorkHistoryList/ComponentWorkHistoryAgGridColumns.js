import React from 'react';
import { MokaTableLoadButton } from '@components';
import { DESK_HIST_PUBLISH } from '@/constants';

export default [
    {
        headerName: 'No',
        field: 'seq',
        width: 50,
        tooltipField: 'seq',
        cellClassRules: {
            'ft-12': () => true,
        },
    },
    {
        headerName: '작업일시',
        field: 'regDt',
        width: 200,
        cellClassRules: {
            'text-positive': ({ data }) => data.approvalYn === 'N' && data.status === DESK_HIST_PUBLISH,
            'ft-12': () => true,
        },
    },
    {
        headerName: '작업자',
        field: 'regId',
        width: 90,
        flex: 1,
        tooltipField: 'regId',
        cellClassRules: {
            'ft-12': () => true,
        },
    },
    {
        headerName: '불러오기',
        field: 'load',
        width: 65,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableLoadButton {...row} onClick={data.handleClickLoad} />;
        },
    },
];
