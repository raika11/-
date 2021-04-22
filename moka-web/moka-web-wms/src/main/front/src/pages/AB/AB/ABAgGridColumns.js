import { GRID_LINE_HEIGHT } from '@/style_constants';

export default [
    {
        headerName: '상태',
        field: 'status',
        tooltipField: 'status',
        width: 40,
        cellRenderer: 'statusRenderer',
        cellClassRules: {
            'ag-center-cell': () => true,
        },
    },
    {
        headerName: '설계명',
        field: 'abtestTitle',
        tooltipField: 'abtestTitle',
        width: 130,
        flex: 1,
        cellRenderer: 'longTextRenderer',
        cellClassRules: {
            'ag-center-cell': () => true,
        },
    },
    {
        headerName: '유형\n테스트대상',
        field: 'typeAndPurpose',
        tooltipField: 'typeAndPurpose',
        width: 100,
        cellRenderer: 'longTextRenderer',
        cellClassRules: {
            'ag-center-cell': () => true,
        },
    },
    {
        headerName: '페이지\n영역',
        field: 'pageAndArea',
        tooltipField: 'pageAndArea',
        width: 170,
        cellRenderer: 'longTextRenderer',
        cellClassRules: {
            'text-center': () => true,
        },
        cellRendererParams: { style: { display: 'block' } },
        /*wrapText: true,
        cellClassRules: {
            'ag-pre-cell': () => true,
        },
        cellStyle: { lineHeight: `${GRID_LINE_HEIGHT.M}px` },*/
    },
    {
        headerName: '시작일시\n종료일시',
        field: 'periodInfo',
        tooltipField: 'periodInfo',
        width: 150,
        cellRenderer: 'longTextRenderer',
    },
    {
        headerName: '작성자\n작성일시',
        field: 'regInfo',
        tooltipField: 'regInfo',
        width: 150,
        cellRenderer: 'longTextRenderer',
    },
];
