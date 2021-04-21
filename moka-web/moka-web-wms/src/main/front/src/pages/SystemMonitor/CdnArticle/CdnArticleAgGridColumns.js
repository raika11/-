import React from 'react';
import { GRID_LINE_HEIGHT } from '@/style_constants';
import TitleRenderer from './components/TitleRenderer';

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.M}px`,
    wordBreak: 'break-word',
};

export default [
    {
        headerName: '기사ID',
        field: 'totalId',
        width: 80,
        cellClass: 'ag-center-cell',
    },
    {
        headerName: '제목 / URL',
        field: 'titleUrl',
        width: 430,
        flex: 1,
        tooltipField: 'unescapeTitle',
        cellRendererFramework: (row) => <TitleRenderer {...row} />,
        cellStyle: { ...cellStyle, paddingTop: '6px', paddingBottom: '6px' },
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 89,
        wrapText: true,
        cellClass: 'ag-prewrap-cell',
        cellStyle,
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 38,
        cellRenderer: 'usedYnRenderer',
    },
];
