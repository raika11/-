export default [
    {
        headerName: 'ID',
        field: 'templateSeq',
        width: 50,
        sortable: true,
        comparator: () => 0,
    },
    {
        headerName: '템플릿명',
        field: 'templateName',
        width: 160,
        flex: 1,
        tooltipField: 'templateName',
        cellClassRules: {
            'usedyn-n': (params) => params.data.usedYn === 'N',
        },
        sortable: true,
        comparator: () => 0,
    },
    {
        headerName: '위치그룹',
        field: 'templateGroupName',
        width: 70,
        tooltipField: 'templateGroupName',
    },
    {
        headerName: '사이즈',
        field: 'templateWidth',
        width: 53,
        tooltipField: 'templateWidth',
    },
];
