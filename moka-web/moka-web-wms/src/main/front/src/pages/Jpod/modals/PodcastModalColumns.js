import { GRID_LINE_HEIGHT } from '@/style_constants';

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.C[0]}px`,
};

export const columnDefs = [
    {
        headerName: '',
        field: 'choice',
        width: 58,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: { text: '선택' },
    },
    {
        headerName: '제목',
        field: 'name',
        width: 200,
        flex: 1,
        tooltipField: 'name',
        cellStyle,
    },
    {
        headerName: '상태',
        field: 'stateText',
        width: 45,
        tooltipField: 'stateText',
        cellStyle,
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 175,
        tooltipField: 'regDt',
        cellStyle,
    },
];
