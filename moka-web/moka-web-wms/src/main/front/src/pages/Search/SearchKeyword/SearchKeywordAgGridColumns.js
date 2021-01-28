const cellClassRules = {
    // 'user-select-text': () => true,
};

export default [
    {
        headerName: '순위',
        field: 'rank',
        width: 50,
        sortable: true,
    },
    {
        headerName: '검색어',
        field: 'schKwd',
        width: 400,
        flex: 1,
        sortable: true,
    },
    {
        headerName: '전체',
        field: 'totalCnt',
        width: 130,
        cellClassRules,
        sortable: true,
    },
    {
        headerName: 'PC',
        field: 'pcCnt',
        width: 130,
        cellClassRules,
        sortable: true,
    },
    {
        headerName: 'Mobile',
        field: 'mobileCnt',
        width: 130,
        cellClassRules,
        sortable: true,
    },
    {
        headerName: 'Tablet',
        field: 'tabletCnt',
        width: 130,
        cellClassRules,
        sortable: true,
    },
];
