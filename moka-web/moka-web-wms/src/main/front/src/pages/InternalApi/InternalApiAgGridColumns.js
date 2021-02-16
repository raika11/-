export default [
    {
        headerName: 'API명',
        field: 'apiName',
        cellStyle: { display: 'flex', alignItems: 'center' },
        width: 120,
        tooltipField: 'apiName',
    },
    {
        headerName: 'API 경로',
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
        headerName: 'API 방식',
        field: 'apiMethod',
        cellStyle: { display: 'flex', alignItems: 'center' },
        width: 80,
    },
];
