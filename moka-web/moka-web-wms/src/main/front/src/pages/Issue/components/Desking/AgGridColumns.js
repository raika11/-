export default [
    {
        rowDrag: true,
        width: 28,
        maxWidth: 28,
        suppressMenu: true,
        rowDragText: (params, dragItemCount) => {
            if (dragItemCount > 1) {
                const message = params.rowNodes ? params.rowNodes[0].data.artTitle : params.rowNode.data.artTitle;
                return `${message}외 [${dragItemCount - 1}건]`;
            }
            return params.rowNode.data.artTitle;
        },
    },
    {
        headerName: 'ID',
        width: 110,
        field: 'sourceName',
        tooltipField: 'sourceName',
    },
    {
        headerName: '카테고리',
        width: 83,
        // width: 93,
        field: 'artIdType',
        tooltipField: 'artTypeName',
    },
    {
        headerName: '유형',
        width: 73,
        field: 'artThumb',
    },
    {
        headerName: '패키지명',
        width: 150,
        flex: 1,
        field: 'groupNumber',
    },
    {
        headerName: '기자정보',
        field: 'artTitle',
        width: 186,
        flex: 1,
        autoHeight: true,
        tooltipField: 'artTitle',
    },
    {
        headerName: '기사수',
        width: 73,
        field: 'artThumb1',
    },
    {
        headerName: '패키지 생성일',
        width: 73,
        field: 'artThumb2',
    },
    {
        headerName: '종료여부',
        width: 63,
        field: 'myunPan',
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '정보',
        width: 95,
        field: 'reportersText',
        cellRenderer: 'buttonRenderer',
    },
];
