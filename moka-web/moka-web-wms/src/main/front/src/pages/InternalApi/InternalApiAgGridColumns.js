import { GRID_LINE_HEIGHT } from '@/style_constants';

const cellClassRules = {
    'ag-center-cell': () => true,
};

export default [
    {
        headerName: 'API명',
        field: 'apiName',
        cellClassRules,
        width: 120,
        tooltipField: 'apiName',
    },
    {
        headerName: 'API 경로',
        field: 'apiPath',
        cellStyle: { lineHeight: `${GRID_LINE_HEIGHT.M}px` },
        wrapText: true,
        cellClassRules,
        width: 250,
    },
    {
        headerName: '설명',
        field: 'apiDesc',
        cellStyle: { lineHeight: `${GRID_LINE_HEIGHT.M}px` },
        wrapText: true,
        cellClassRules,
        flex: 1,
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 40,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: 'API 방식',
        field: 'apiMethod',
        cellClassRules,
        width: 80,
    },
];
