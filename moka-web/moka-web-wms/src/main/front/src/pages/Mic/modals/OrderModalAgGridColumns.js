export default [
    {
        headerName: '',
        rowDrag: true,
        width: 24,
        maxWidth: 24,
        suppressMenu: true,
        rowDragText: (params) => params.rowNode.data.agndTitle,
    },
    {
        headerName: '',
        field: 'ordNo',
        width: 30,
        maxWidth: 30,
        cellStyle: { lineHeight: '34px' },
    },
    {
        headerName: '아젠다명',
        field: 'agndTitle',
        tooltipField: 'agndTitle',
        flex: 1,
        cellStyle: { lineHeight: '34px' },
    },
];
