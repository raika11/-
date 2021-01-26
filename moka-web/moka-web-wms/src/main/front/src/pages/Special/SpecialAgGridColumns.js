const columnDefs = [
    {
        headerName: 'No',
        field: 'seqNo',
        width: 70,
        cellClassRules: {
            'ft-12': () => true,
        },
        tooltipField: 'seqNo',
    },
    {
        headerName: '페이지 코드',
        field: 'pageCdName',
        width: 100,
        cellClassRules: {
            'ft-12': () => true,
        },
    },
    {
        headerName: '제목',
        field: 'pageTitle',
        width: 320,
        flex: 1,
        cellClassRules: {
            'ft-12': () => true,
        },
        tooltipField: 'pageTitle',
    },
    {
        headerName: '게시일',
        field: 'pageSdate',
        width: 80,
        cellClassRules: {
            'ft-12': () => true,
        },
    },
    {
        headerName: '등록일',
        field: 'regDtText',
        width: 80,
        cellClassRules: {
            'ft-12': () => true,
        },
    },
    {
        headerName: '노출',
        field: 'listYn',
        width: 50,
        cellClassRules: {
            'ft-12': () => true,
        },
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 50,
        cellClassRules: {
            'ft-12': () => true,
        },
    },
];

export default columnDefs;
