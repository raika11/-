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
        width: 52,
        cellStyle: { lineHeight: '43px' },
    },
    {
        headerName: '사진',
        field: 'repImg',
        width: 50,
        cellRenderer: 'circleImageRenderer',
        cellStyle: { padding: '3px 6px' },
    },
    {
        headerName: '이름',
        field: 'repName',
        width: 100,
        cellStyle: { lineHeight: '43px' },
    },
    {
        headerName: '아이디',
        field: 'joinsId',
        tooltipField: 'joinsId',
        width: 150,
        cellStyle: { lineHeight: '43px' },
    },
    {
        headerName: '이메일',
        field: 'repEmail1',
        tooltipField: 'repEmail1',
        width: 220,
        flex: 1,
        cellStyle: { lineHeight: '43px' },
    },
    {
        headerName: '노출여부',
        field: 'usedYn',
        width: 64,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '',
        field: 'reporterPage',
        width: 95,
        cellRendererFramework: (row) => <ReporterPageButton {...row} />,
    },
];
