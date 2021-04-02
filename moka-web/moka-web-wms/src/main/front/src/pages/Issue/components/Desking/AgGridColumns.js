export default [
    {
        rowDrag: true,
        width: 28,
        maxWidth: 28,
        suppressMenu: true,
        rowDragText: (params, dragItemCount) => {
            return params.rowNode.data.pkgTitle;
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
        tooltipField: 'catName',
    },
    {
        headerName: '유형',
        width: 80,
        field: 'divName',
    },
    {
        headerName: '패키지명',
        width: 200,
        flex: 1,
        field: 'pkgTitle',
        tooltipField: 'pkgTitle',
    },
    {
        headerName: '기자정보',
        field: 'repName',
        width: 110,
        tooltipField: 'fullRepName',
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
