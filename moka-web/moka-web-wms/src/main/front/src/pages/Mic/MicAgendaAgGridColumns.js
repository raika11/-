export default [
    {
        headerName: '번호',
        field: 'agndSeq',
        width: 50,
    },
    {
        headerName: '아젠다',
        field: 'agndTitle',
        flex: 1,
        tooltipField: 'agndTitle',
    },
    {
        headerName: '포스트',
        width: 60,
        field: 'answCnt',
        cellClassRules: {
            'color-info': () => true,
        },
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 130,
    },
    {
        headerName: '공개일',
        field: 'agndServiceDt',
        width: 95,
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 38,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '최상단',
        field: 'agndTop',
        cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
        width: 51,
    },
];
