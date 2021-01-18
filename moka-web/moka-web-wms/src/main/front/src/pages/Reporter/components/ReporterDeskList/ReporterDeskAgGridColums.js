import React from 'react';
import ReporterPageButton from '../ReporterPageButton';

export default [
    {
        headerName: '',
        rowDrag: true,
        width: 24,
    },
    {
        headerName: '번호',
        field: 'repSeq',
        cellStyle: { fontSize: '12px' },
        tooltipField: 'repSeq',
        width: 70,
    },
    {
        headerName: '아이디',
        field: 'joinsId',
        cellStyle: { fontSize: '12px' },
        tooltipField: 'joinsId',
        width: 100,
    },
    {
        headerName: '이름',
        field: 'repName',
        cellStyle: { fontSize: '12px' },
        width: 80,
    },
    {
        headerName: '소속',
        field: 'belong',
        cellStyle: { fontSize: '12px' },
        width: 200,
        tooltipField: 'belong',
        flex: 1,
    },
    {
        headerName: '이메일',
        field: 'repEmail1',
        cellStyle: { fontSize: '12px' },
        tooltipField: 'repEmail1',
        width: 180,
    },
    {
        headerName: '',
        field: 'reporterPage',
        width: 95,
        cellRendererFramework: (row) => <ReporterPageButton {...row} />,
    },
];