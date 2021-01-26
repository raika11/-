export default [
    {
        headerName: 'API명',
        field: 'apiName',
        width: 120,
        tooltipField: 'apiName',
    },
    {
        headerName: 'API경로',
        field: 'apiPath',
        cellStyle: { lineHeight: '21px' },
        wrapText: true,
        autoHeight: true,
        width: 250,
    },
    {
        headerName: '설명',
        field: 'apiDesc',
        cellStyle: { lineHeight: '21px' },
        flex: 1,
        autoHeight: true,
        wrapText: true,
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 40,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: 'API방식',
        field: 'apiMethod',
        width: 80,
    },
];
