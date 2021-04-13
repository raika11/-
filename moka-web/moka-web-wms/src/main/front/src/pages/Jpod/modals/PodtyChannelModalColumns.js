import { GRID_LINE_HEIGHT } from '@/style_constants';

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.C[0]}px`,
};

export const columnDefs = [
    {
        headerName: '채널명',
        field: 'getCastName',
        width: 250,
        flex: 1,
        tooltipField: 'getCastName',
        cellStyle,
    },
    {
        headerName: '개설일',
        field: 'crtDt',
        width: 100,
        tooltipField: 'crtDt',
        cellStyle,
    },
    {
        headerName: '채널번호',
        field: 'castSrl',
        width: 80,
        tooltipField: 'castSrl',
        cellStyle,
    },
    {
        headerName: '총회차',
        field: 'trackCnt',
        width: 60,
        tooltipField: 'trackCnt',
        cellStyle,
    },
    {
        headerName: '분류',
        field: 'simpodCategory',
        width: 100,
        tooltipField: 'simpodCategory',
        cellStyle,
    },
    {
        headerName: '보기',
        field: 'move',
        width: 58,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: { text: '이동' },
    },
];
