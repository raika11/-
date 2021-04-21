export const columnDefs = [
    {
        rowDrag: true,
        width: 28,
        minWidth: 28,
        suppressMenu: true,
        rowDragText: (params) => {
            return params.rowNode.data.menuDisplayNm;
        },
        cellClass: 'ag-content-center-cell',
    },
    {
        headerName: '번호',
        field: 'menuSeq',
        width: 50,
    },
    {
        headerName: '메뉴명',
        field: 'menuDisplayNm',
        width: 140,
        flex: 1,
        cellStyle: { cursor: 'pointer' },
    },
    {
        headerName: '',
        field: 'usedYn',
        width: 38,
        cellRenderer: 'usedYnRenderer',
    },
];
