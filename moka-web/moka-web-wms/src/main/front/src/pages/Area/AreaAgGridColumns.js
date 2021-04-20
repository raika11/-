const columnDefs = [
    {
        headerName: '',
        rowDrag: true,
        width: 28,
        maxWidth: 28,
        rowDragText: (params) => params.rowNode.data.areaNm,
        cellClass: 'ag-content-center-cell',
    },
    {
        headerName: '편집영역명',
        field: 'areaNm',
        width: 130,
        flex: 1,
        tooltipField: 'areaNm',
        cellStyle: { cursor: 'pointer' },
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 40,
        cellRenderer: 'usedYnRenderer',
    },
];

export default columnDefs;
