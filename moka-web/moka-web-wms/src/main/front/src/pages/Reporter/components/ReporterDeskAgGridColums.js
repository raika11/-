export default [
    {
        rowDrag: true,
        width: 22,
        suppressMenu: true,
        rowDragText: (params, dragItemCount) => {
            // if (dragItemCount > 1) {
            //     const message = params.rowNodes ? params.rowNodes.reduce((prev, next) => `${prev.data.escapeTitle},${next.data.escapeTitle}`) : params.rowNode.data.escapeTitle;
            //     return `${message}외 [${dragItemCount - 1}건]`;
            // }
            // return params.rowNode.data.escapeTitle;
            return null;
        },
    },
    {
        headerName: 'No',
        field: 'repSeq',
        cellStyle: { fontSize: '12px' },
        width: 80,
    },
    {
        headerName: '아이디',
        field: 'joinsId',
        cellStyle: { fontSize: '12px' },
        width: 100,
    },
    {
        headerName: '사진',
        field: 'repImg',
        cellRenderer: 'imageRenderer',
    },
    {
        headerName: '이름',
        field: 'repName',
        cellStyle: { fontSize: '12px' },
        width: 100,
    },
    {
        headerName: '소속',
        field: 'belong',
        cellStyle: { fontSize: '12px' },
        width: 140,
    },
    {
        headerName: '이메일',
        field: 'repEmail1',
        cellStyle: { fontSize: '12px' },
        width: 160,
    },
];
