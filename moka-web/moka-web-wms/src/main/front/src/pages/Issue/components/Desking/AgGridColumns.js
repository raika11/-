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
        width: 55,
        field: 'pkgSeq',
    },
    {
        headerName: '카테고리',
        width: 110,
        field: 'catName',
    },
    {
        headerName: '유형',
        width: 80,
        field: 'divName',
    },
    {
        headerName: '패키지명',
        width: 200,
        flex: 2,
        field: 'pkgTitle',
        tooltipField: 'pkgTitle',
    },
    {
        headerName: '기자정보',
        field: 'artTitle',
        width: 186,
        flex: 1,
        tooltipField: 'artTitle',
    },
    {
        headerName: '기사수',
        width: 70,
        field: 'artCnt',
    },
    {
        headerName: '패키지 생성일',
        width: 100,
        field: 'regDt',
    },
    {
        headerName: '종료여부',
        width: 63,
        field: 'usedYn',
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '',
        width: 64,
        field: '정보',
        cellRenderer: 'buttonRenderer',
    },
];
