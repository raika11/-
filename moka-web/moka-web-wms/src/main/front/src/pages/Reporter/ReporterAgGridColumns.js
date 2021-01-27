import React from 'react';
import ReporterPageButton from './components/ReporterPageButton';

export const columnDefs = [
    {
        headerName: '번호',
        field: 'repSeq',
        tooltipField: 'repSeq',
        width: 70,
    },
    {
        headerName: '아이디',
        field: 'joinsId',
        tooltipField: 'joinsId',
        width: 100,
    },
    {
        headerName: '이름',
        field: 'repName',
        width: 80,
    },
    {
        headerName: '소속',
        field: 'belong',
        width: 200,
        tooltipField: 'belong',
        flex: 1,
    },
    {
        headerName: '이메일',
        field: 'repEmail1',
        tooltipField: 'repEmail1',
        width: 180,
    },
    // {
    //     headerName: '노출여부',
    //     field: 'usedYn',
    //     cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    //     width: 64,
    // },
    {
        headerName: '',
        field: 'reporterPage',
        width: 95,
        cellRendererFramework: (row) => <ReporterPageButton {...row} />,
    },
];
