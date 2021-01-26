const columnDefs = [
    {
        headerName: 'No',
        field: 'seqNo',
        width: 70,
        tooltipField: 'seqNo',
    },
    {
        headerName: '페이지 코드',
        field: 'pageCdName',
        width: 100,
    },
    {
        headerName: '제목',
        field: 'pageTitle',
        width: 320,
        flex: 1,
        tooltipField: 'pageTitle',
    },
    {
        headerName: '게시일',
        field: 'pageSdate',
        width: 93,
    },
    {
        headerName: '등록일',
        field: 'regDtText',
        width: 93,
    },
    {
        headerName: '노출',
        field: 'listYn',
        width: 50,
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 50,
    },
];

export default columnDefs;
