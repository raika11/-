const columnDefs = [
    {
        headerName: '',
        rowDrag: true,
        width: 24,
        maxWidth: 24,
        rowDragText: (params) => params.rowNode.data.areaNm,
    },
    {
        headerName: '편집영역명',
        field: 'areaNm',
        width: 130,
        flex: 1,
        tooltipField: 'areaNm',
        cellStyle: { lineHeight: '34px', cursor: 'pointer' },
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 40,
        cellRenderer: 'usedYnRenderer',
        cellStyle: { lineHeight: '34px' },
    },
];

export default columnDefs;
