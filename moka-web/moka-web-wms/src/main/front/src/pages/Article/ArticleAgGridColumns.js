import React from 'react';
import ArticleActionBtn from './components/ArticleActionBtn';
import ArticleViewBtn from './components/ArticleViewBtn';
import SourceRenderer from './components/SourceRenderer';
// import TitleRenderer from './components/TitleRenderer';

export default [
    {
        headerName: '매체/분류',
        colId: 'source',
        width: 150,
        wrapText: true,
        autoHeight: true,
        cellStyle: { lineHeight: '21px', display: 'flex', alignItems: 'center' },
        cellRendererFramework: (row) => <SourceRenderer {...row} />,
    },
    {
        headerName: '보기',
        field: 'view',
        width: 139,
        cellStyle: { display: 'flex', alignItems: 'center' },
        cellRendererFramework: (row) => <ArticleViewBtn {...row} />,
    },
    {
        headerName: '제목',
        field: 'artTitle',
        flex: 1,
        width: 100,
        tooltipField: 'artTitle',
        cellStyle: { lineHeight: '21px', display: 'flex', alignItems: 'center' },
        wrapText: true,
        autoHeight: true,
        // cellRendererFramework: (row) => <TitleRenderer {...row} />,
    },
    {
        headerName: '면/판',
        field: 'myunPan',
        width: 45,
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            whiteSpace: 'pre',
        },
    },
    {
        headerName: '등록시간',
        field: 'regDt',
        width: 80,
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
            fontSize: '12px',
        },
    },
    {
        headerName: '기능',
        field: 'register',
        width: 135,
        cellStyle: { display: 'flex', alignItems: 'center' },
        cellRendererFramework: (row) => <ArticleActionBtn {...row} />,
    },
];
