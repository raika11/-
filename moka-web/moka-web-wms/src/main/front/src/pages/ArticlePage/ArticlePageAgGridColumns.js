export default [
    {
        headerName: 'ID',
        field: 'artPageSeq',
        width: 50,
    },
    {
        headerName: '아티클페이지명',
        field: 'artPageName',
        width: 160,
        flex: 1,
        tooltipField: 'artPageName',
        cellClassRules: {
            'usedyn-n': (params) => params.data.usedYn === 'N',
        },
    },
];
