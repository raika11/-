export default [
    {
        headerName: 'ID',
        field: 'componentSeq',
        width: 50,
    },
    {
        headerName: '컴포넌트명',
        field: 'componentName',
        width: 160,
        flex: 1,
        tooltipField: 'componentName',
        cellClassRules: {
            'usedyn-n': (params) => params.data.usedYn === 'N',
        },
    },
    {
        headerName: '위치그룹',
        field: 'templateGroupName',
        width: 100,
        tooltipField: 'templateGroupName',
    },
];
