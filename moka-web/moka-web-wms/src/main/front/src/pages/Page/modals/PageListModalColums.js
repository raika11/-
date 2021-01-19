export default [
    { headerName: '', checkboxSelection: true, width: 35 },
    {
        headerName: 'ID',
        field: 'pageSeq',
        width: 70,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '페이지명',
        field: 'pageName',
        width: 120,
        flex: 1,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'pageName',
    },
    {
        headerName: '페이지URL',
        field: 'pageUrl',
        width: 264,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'pageUrl',
    },
];
