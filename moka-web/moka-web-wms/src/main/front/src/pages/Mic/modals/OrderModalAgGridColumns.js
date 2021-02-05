const replaceNo = (t) => ('00' + t).slice(-2);

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
        valueGetter: (params) => replaceNo(params.data.ordNo),
        cellStyle: { lineHeight: '34px' },
    },
    {
        headerName: '아젠다명',
        field: 'agndKwd',
        tooltipField: 'agndKwd',
        flex: 1,
        cellStyle: { lineHeight: '34px' },
    },
];
