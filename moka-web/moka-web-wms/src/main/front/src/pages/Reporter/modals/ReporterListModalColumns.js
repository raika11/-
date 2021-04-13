import React from 'react';
import ReporterPageButton from '../components/ReporterPageButton';

export default [
    {
        headerName: '',
        field: 'add',
        width: 60,
        cellRenderer: 'buttonRenderer',
    },
    {
        headerName: '번호',
        field: 'repSeq',
        width: 52,
        cellStyle: { lineHeight: '43px' },
    },
    {
        headerName: '타입코드',
        field: 'jplusRepDivNm',
        width: 63,
        cellStyle: { lineHeight: '43px' },
    },
    {
        headerName: '사진',
        field: 'repImg',
        width: 50,
        cellRenderer: 'imageRenderer',
        cellRendererParams: { roundedCircle: true, autoRatio: false },
        cellStyle: { padding: '3px 6px' },
    },
    {
        headerName: '이름',
        field: 'repName',
        width: 75,
        cellStyle: { lineHeight: '43px' },
    },
    {
        headerName: '아이디',
        field: 'joinsId',
        width: 100,
        tooltipField: 'joinsId',
        cellStyle: { lineHeight: '43px' },
    },
    {
        headerName: '이메일',
        field: 'repEmail1',
        width: 180,
        flex: 1,
        tooltipField: 'repEmail1',
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
