const replaceNo = (t) => ('00' + t).slice(-2);

export default [
    {
        headerName: '',
        rowDrag: true,
        width: 28,
        maxWidth: 28,
        suppressMenu: true,
        rowDragText: (params) => params.rowNode.data.agndTitle,
        cellClass: 'ag-content-center-cell',
    },
    {
        headerName: '',
        field: 'ordNo',
        width: 30,
        maxWidth: 30,
        valueGetter: (params) => replaceNo(params.data.ordNo),
    },
    {
        headerName: '아젠다명',
        field: 'agndKwd',
        tooltipField: 'agndKwd',
        flex: 1,
    },
];
