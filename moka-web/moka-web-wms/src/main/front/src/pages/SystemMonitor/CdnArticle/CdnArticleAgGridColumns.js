import React from 'react';
import TitleRenderer from './components/TitleRenderer';

export default [
    {
        headerName: '기사ID',
        field: 'totalId',
        width: 80,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '제목 / URL',
        field: 'titleUrl',
        width: 440,
        flex: 1,
        autoHeight: true,
        cellStyle: { lineHeight: '18px', height: '60px' },
        cellRendererFramework: (row) => <TitleRenderer {...row} />,
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 76,
        wrapText: true,
        cellStyle: { fontSize: '12px', lineHeight: '21px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '사용여부',
        field: 'usedYn',
        width: 64,
        cellRenderer: 'usedYnRenderer',
    },
];
