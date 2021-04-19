export default [
    {
        headerName: 'NO',
        field: 'no',
        width: 40,
    },
    {
        headerName: '유형',
        field: 'letterType',
        sortable: true,
        unSortIcon: true,
        sort: null,
        sortingOrder: ['asc', 'desc'],
        width: 100,
    },
    {
        headerName: '뉴스레터 명',
        field: 'letterName',
        sortable: true,
        unSortIcon: true,
        sort: null,
        sortingOrder: ['asc', 'desc'],
        width: 120,
    },
    {
        headerName: '제목',
        field: 'letterTitle',
        flex: 1,
    },
    {
        headerName: '발송일',
        field: 'sendDt',
        sortable: true,
        unSortIcon: true,
        sort: null,
        sortingOrder: ['asc', 'desc'],
        width: 100,
    },
    {
        headerName: 'A/B TEST',
        field: 'abtestYn',
        width: 70,
    },
];
