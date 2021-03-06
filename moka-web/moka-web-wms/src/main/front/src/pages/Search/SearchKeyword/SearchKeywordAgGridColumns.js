export default [
    {
        headerName: '순위',
        field: 'rank',
        width: 50,
    },
    {
        headerName: '검색어',
        field: 'schKwd',
        width: 200,
        flex: 1,
        tooltipField: 'schKwd',
    },
    {
        headerName: '전체',
        field: 'totalCnt',
        width: 130,
        sortable: true,
        comparator: () => 0,
    },
    {
        headerName: 'PC',
        field: 'pcCnt',
        width: 130,
        sortable: true,
        comparator: () => 0,
    },
    {
        headerName: 'Mobile',
        field: 'mobileCnt',
        width: 130,
        sortable: true,
        comparator: () => 0,
    },
    {
        headerName: 'Tablet',
        field: 'tabletCnt',
        width: 130,
        sortable: true,
        comparator: () => 0,
    },
];
