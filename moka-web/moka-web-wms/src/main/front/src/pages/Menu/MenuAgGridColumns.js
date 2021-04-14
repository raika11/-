export const columnDefs = [
    {
        rowDrag: true,
        width: 24,
        minWidth: 24,
        suppressMenu: true,
        rowDragText: (params) => {
            return params.rowNode.data.menuDisplayNm;
        },
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
