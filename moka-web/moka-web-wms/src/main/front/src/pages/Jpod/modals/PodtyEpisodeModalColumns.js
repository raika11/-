export const columnDefs = [
    {
        headerName: '에피소드명',
        field: 'title',
        width: 200,
        tooltipField: 'title',
        cellRenderer: 'longTextRenderer',
    },
    {
        headerName: '게시일',
        field: 'crtDt',
        width: 90,
        tooltipField: 'crtDt',
        cellClass: 'ag-center-cell',
    },
    {
        headerName: '제작자',
        field: 'author',
        width: 80,
        tooltipField: 'author',
        cellClass: 'ag-center-cell',
    },
    {
        headerName: '소개',
        field: 'summary',
        flex: 1,
        tooltipField: 'summary',
        cellRenderer: 'longTextRenderer',
    },
    {
        headerName: '보기',
        field: 'move',
        width: 58,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: { text: '이동' },
    },
];
