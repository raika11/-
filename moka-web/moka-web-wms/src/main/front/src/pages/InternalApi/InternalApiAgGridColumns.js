const cellClassRules = {
    'ag-center-cell': () => true,
};

export default [
    {
        headerName: 'API명',
        field: 'apiName',
        cellClassRules,
        width: 120,
        tooltipField: 'apiName',
    },
    {
        headerName: 'API 경로',
        field: 'apiPath',
        cellRenderer: 'longTextRenderer',
        tooltipField: 'apiPath',
        width: 250,
    },
    {
        headerName: '설명',
        field: 'apiDesc',
        cellRenderer: 'longTextRenderer',
        flex: 1,
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
        cellClassRules,
        width: 80,
    },
];
