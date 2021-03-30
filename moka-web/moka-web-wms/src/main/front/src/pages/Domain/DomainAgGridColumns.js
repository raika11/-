export const columnDefs = [
    {
        headerName: 'ID',
        field: 'domainId',
        width: 50,
    },
    {
        headerName: 'URL',
        field: 'domainUrl',
        width: 200,
        flex: 1,
        tooltipField: 'domainUrl',
    },
    {
        headerName: '도메인명',
        field: 'domainName',
        width: 94,
        flex: 1,
        tooltipField: 'domainName',
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 40,
        cellRenderer: 'usedYnRenderer',
    },
];
