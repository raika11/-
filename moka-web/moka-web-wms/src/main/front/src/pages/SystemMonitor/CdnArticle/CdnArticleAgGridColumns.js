import React from 'react';
import TitleRenderer from './components/TitleRenderer';

export default [
    {
        headerName: '기사ID',
        field: 'totalId',
        width: 80,
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '제목 / URL',
        field: 'titleUrl',
        width: 430,
        flex: 1,
        autoHeight: true,
        cellStyle: { lineHeight: '18px', height: '60px' },
        tooltipField: 'title',
        cellRendererFramework: (row) => <TitleRenderer {...row} />,
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 89,
        wrapText: true,
        cellStyle: { lineHeight: '21px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 38,
        cellRenderer: 'usedYnRenderer',
    },
];
