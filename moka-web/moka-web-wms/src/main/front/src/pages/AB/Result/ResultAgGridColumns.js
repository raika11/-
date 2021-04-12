import { GRID_LINE_HEIGHT } from '@/style_constants';

export default [
    {
        headerName: '설계명',
        field: 'title',
        width: 130,
        flex: 1,
        wrapText: true,
    },
    {
        headerName: '유형\n테스트대상',
        field: 'test1',
        width: 150,
        wrapText: true,
        cellClassRules: {
            'ag-pre-cell': () => true,
        },
        cellStyle: { lineHeight: `${GRID_LINE_HEIGHT.M}px` },
    },
    {
        headerName: '페이지\n영역',
        field: 'test2',
        width: 150,
        wrapText: true,
        cellClassRules: {
            'ag-pre-cell': () => true,
        },
        cellStyle: { lineHeight: `${GRID_LINE_HEIGHT.M}px` },
    },
    {
        headerName: '시작일시\n종료일시',
        field: 'test3',
        width: 170,
        wrapText: true,
        cellClassRules: {
            'ag-pre-cell': () => true,
        },
        cellStyle: { lineHeight: `${GRID_LINE_HEIGHT.M}px` },
    },
    {
        headerName: '작성자\n작성일시',
        field: 'test4',
        width: 170,
        wrapText: true,
        cellClassRules: {
            'ag-pre-cell': () => true,
        },
        cellStyle: { lineHeight: `${GRID_LINE_HEIGHT.M}px` },
    },
    {
        headerName: '결과',
        field: 'test5',
        width: 100,
        wrapText: true,
        cellStyle: { lineHeight: `${GRID_LINE_HEIGHT.M}px` },
    },
];
