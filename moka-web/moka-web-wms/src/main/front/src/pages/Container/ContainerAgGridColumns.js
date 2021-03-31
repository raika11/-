export default [
    {
        headerName: 'ID',
        field: 'containerSeq',
        width: 60,
    },
    {
        headerName: '컨테이너명',
        field: 'containerName',
        flex: 1,
        width: 268,
        tooltipField: 'containerName',
        cellClassRules: {
            'usedyn-n': (params) => params.data.usedYn === 'N',
        },
    },
];
