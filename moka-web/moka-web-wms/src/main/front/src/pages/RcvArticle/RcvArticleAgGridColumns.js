import React from 'react';
import RcvArticleRegisterBtn from './components/RcvArticleRegisterBtn';
import RcvArticlePreviewBtn from './components/RcvArticlePreviewBtn';
import TitleRenderer from './components/TitleRenderer';

export default [
    {
        headerName: '월일',
        field: 'rcvDt',
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
        field: 'sourceName',
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
        field: 'title',
        flex: 1,
        width: 100,
        tooltipField: 'title',
        cellRendererFramework: (row) => <TitleRenderer {...row} />,
    },
    {
        headerName: '입력',
        field: 'serviceTime',
        width: 50,
        cellStyle: { fontSize: '12px' },
        cellClassRules: {
            'text-positive': () => true,
        },
    },
    {
        headerName: '기능',
        field: 'register',
        width: 55,
        cellRendererFramework: (row) => <RcvArticleRegisterBtn {...row} />,
    },
];
