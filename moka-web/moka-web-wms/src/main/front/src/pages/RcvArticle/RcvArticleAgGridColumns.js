import React from 'react';
import RcvArticleRegisterBtn from './components/RcvArticleRegisterBtn';
import RcvArticlePreviewBtn from './components/RcvArticlePreviewBtn';
import TitleRenderer from './components/TitleRenderer';

export default [
    {
        headerName: '월일',
        field: 'rcvDate',
        width: 50,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '수신',
        field: 'rcvTime',
        width: 50,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '구분',
        field: 'source',
        width: 70,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '보기',
        field: 'preview',
        width: 55,
        cellRendererFramework: (row) => <RcvArticlePreviewBtn {...row} />,
    },
    {
        headerName: '제목',
        field: 'artTitle',
        flex: 1,
        width: 100,
        tooltipField: 'artTitle',
        cellRendererFramework: (row) => <TitleRenderer {...row} />,
    },
    {
        headerName: '입력',
        field: 'regTime',
        width: 65,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '기능',
        field: 'register',
        width: 55,
        cellRendererFramework: (row) => <RcvArticleRegisterBtn {...row} />,
    },
];
