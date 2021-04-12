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
    },
    {
        headerName: '타입코드',
        field: 'jplusRepDivNm',
        width: 63,
    },
    {
        headerName: '사진',
        field: 'repImg',
        width: 50,
        cellRenderer: 'circleImageRenderer',
    },
    {
        headerName: '이름',
        field: 'repName',
        width: 100,
    },
    {
        headerName: '아이디',
        field: 'joinsId',
        tooltipField: 'joinsId',
        width: 150,
    },
    {
        headerName: '이메일',
        field: 'repEmail1',
        tooltipField: 'repEmail1',
        width: 220,
        flex: 1,
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
