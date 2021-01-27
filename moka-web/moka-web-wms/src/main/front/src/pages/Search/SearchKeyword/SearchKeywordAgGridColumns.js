const cellClassRules = {
    // 'user-select-text': () => true,
};

export default [
    {
        headerName: '순위',
        field: 'rank',
        width: 40,
    },
    {
        headerName: '검색어',
        field: 'schKwd',
        width: 400,
        flex: 1,
    },
    {
        headerName: '전체',
        field: 'totalCnt',
        width: 130,
        cellClassRules,
    },
    {
        headerName: 'PC',
        field: 'pcCnt',
        width: 130,
        cellClassRules,
    },
    {
        headerName: 'Mobile',
        field: 'mobileCnt',
        width: 130,
        cellClassRules,
    },
    {
        headerName: 'Tablet',
        field: 'tabletCnt',
        width: 130,
        cellClassRules,
    },
];
