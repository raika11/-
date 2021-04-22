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
        cellRendererParams: { cellClass: 'ag-preline-cell justify-content-center' },
    },
    {
        headerName: '테스트 명',
        field: 'abtestTitle',
        tooltipField: 'abtestTitle',
        width: 130,
        flex: 1,
        cellRenderer: 'longTextRenderer',
        cellClassRules: {
            'ag-center-cell': () => true,
        },
        cellRendererParams: { cellClass: 'ag-preline-cell justify-content-center' },
    },
    {
        headerName: '테스트 대상',
        field: 'abtestPurposeNm',
        tooltipField: 'abtestPurposeNm',
        width: 100,
        cellRenderer: 'longTextRenderer',
        cellClassRules: {
            'ag-center-cell': () => true,
        },
        cellRendererParams: { cellClass: 'ag-preline-cell justify-content-center' },
    },
    {
        headerName: '페이지\n영역',
        field: 'pageAndArea',
        tooltipField: 'pageAndArea',
        width: 170,
        cellRenderer: 'longTextRenderer',
    },
    {
        headerName: '시작일시\n종료일시',
        field: 'periodInfo',
        tooltipField: 'periodInfo',
        width: 150,
        cellRenderer: 'longTextRenderer',
        cellRendererParams: { cellClass: 'ag-preline-cell justify-content-center' },
    },
    {
        headerName: '작성자\n작성일시',
        field: 'regInfo',
        tooltipField: 'regInfo',
        width: 150,
        cellRenderer: 'longTextRenderer',
        cellRendererParams: { cellClass: 'ag-preline-cell justify-content-center' },
    },
];
