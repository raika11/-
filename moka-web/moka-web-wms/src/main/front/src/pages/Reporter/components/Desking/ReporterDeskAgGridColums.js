import React from 'react';
import ReporterPageButton from '../ReporterPageButton';

export default [
    {
        headerName: '',
        rowDrag: true,
        width: 24,
        minWidth: 24,
        rowDragText: (params) => {
            return params.rowNode.data.repName;
        },
    },
    {
        headerName: '번호',
        field: 'repSeq',
        width: 55,
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
        width: 150,
        tooltipField: 'belong',
        flex: 1,
    },
    {
        headerName: '이메일',
        field: 'repEmail1',
        tooltipField: 'repEmail1',
        width: 250,
    },
    {
        headerName: '',
        field: 'reporterPage',
        width: 95,
        cellRendererFramework: (row) => <ReporterPageButton {...row} />,
    },
];
