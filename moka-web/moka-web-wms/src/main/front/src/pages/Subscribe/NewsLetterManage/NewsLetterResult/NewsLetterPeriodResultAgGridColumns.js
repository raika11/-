export default [
    {
        headerName: 'NO',
        field: 'no',
        width: 40,
    },
    {
        headerName: '날짜',
        field: 'date',
        width: 120,
    },
    {
        headerName: '요일 구분',
        field: 'day',
        width: 100,
    },
    {
        headerName: '발송 건수',
        field: 'sendTotal',
        sortable: true,
        unSortIcon: true,
        sort: null,
        sortingOrder: ['asc', 'desc'],
        flex: 1,
    },
    {
        headerName: '발송 결과',
        field: 'sendResult',
        children: [{ headerName: '성공건 / 성공률', field: 'successRate', width: 350, sortable: true, unSortIcon: true, sort: null, sortingOrder: ['asc', 'desc'] }],
    },
    {
        headerName: '오픈 결과',
        field: 'openResult',
        children: [{ headerName: '오픈건 / 오픈률', field: 'openRate', width: 350, sortable: true, unSortIcon: true, sort: null, sortingOrder: ['asc', 'desc'] }],
    },
    {
        headerName: '클릭 결과',
        field: 'clickResult',
        children: [{ headerName: '클릭률', field: 'clickRate', width: 350, sortable: true, unSortIcon: true, sort: null, sortingOrder: ['asc', 'desc'] }],
    },
];
