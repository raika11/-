export default [
    { headerName: '', checkboxSelection: true, width: 35 },
    {
        headerName: 'ID',
        field: 'templateSeq',
        width: 70,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '템플릿명',
        field: 'templateName',
        width: 333,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'templateName',
    },
    {
        headerName: '위치그룹',
        field: 'templateGroupName',
        width: 120,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'templateGroupName',
    },
    {
        headerName: '사이즈',
        field: 'templateWidth',
        width: 80,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'templateWidth',
    },
];
