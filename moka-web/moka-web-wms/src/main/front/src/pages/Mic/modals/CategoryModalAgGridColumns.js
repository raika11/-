const replaceNo = (t) => ('00' + t).slice(-2);

export default [
    {
        headerName: '',
        rowDrag: true,
        width: 24,
        maxWidth: 24,
        rowDragText: (params) => params.rowNode.data.catNm,
    },
    {
        headerName: '',
        field: 'ordNo',
        width: 30,
        maxWidth: 30,
        valueGetter: (params) => replaceNo(params.data.ordNo),
        cellStyle: { lineHeight: '21px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '카테고리명',
        field: 'catNm',
        flex: 1,
        width: 350,
        cellRenderer: 'inputRenderer',
        // valueSetter: () => true,
    },
    {
        headerName: '사용유무',
        width: 120,
        field: 'usedYn',
        cellRenderer: 'selector',
        valueSetter: () => true,
    },
];
