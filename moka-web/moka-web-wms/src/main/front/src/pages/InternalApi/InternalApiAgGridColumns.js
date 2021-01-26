export default [
    {
        headerName: 'API명',
        field: 'apiName',
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        width: 120,
        tooltipField: 'apiName',
    },
    {
        headerName: 'API경로',
        field: 'apiPath',
        cellStyle: { fontSize: '12px', display: 'flex', lineHeight: '21px', alignItems: 'center' },
        wrapText: true,
        autoHeight: true,
        width: 250,
    },
    {
        headerName: '설명',
        field: 'apiDesc',
        cellStyle: { fontSize: '12px', lineHeight: '21px', display: 'flex', alignItems: 'center' },
        flex: 1,
        autoHeight: true,
        wrapText: true,
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 40,
        cellStyle: { display: 'flex', alignItems: 'center' },
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: 'HTTP메소드',
        field: 'apiMethod',
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        width: 80,
    },
];
