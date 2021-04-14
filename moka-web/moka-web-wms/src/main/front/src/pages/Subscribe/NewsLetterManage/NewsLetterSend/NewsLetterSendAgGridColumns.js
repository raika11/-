export default [
    {
        headerName: 'NO',
        field: 'no',
        width: 40,
    },
    {
        headerName: '유형',
        field: 'type',
        sortable: true,
        unSortIcon: true,
        sort: null,
        sortingOrder: ['asc', 'desc'],
        width: 100,
    },
    {
        headerName: '뉴스레터 명',
        field: 'newsLetter',
        sortable: true,
        unSortIcon: true,
        sort: null,
        sortingOrder: ['asc', 'desc'],
        width: 120,
    },
    {
        headerName: '제목',
        field: 'title',
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
        field: 'ab',
        width: 70,
    },
];
