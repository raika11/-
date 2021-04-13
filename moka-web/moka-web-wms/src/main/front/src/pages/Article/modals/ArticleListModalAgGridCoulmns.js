const cellClassRules = {
    'ag-center-cell': () => true,
};

export default [
    {
        headerName: '',
        field: 'add',
        width: 60,
        cellRenderer: 'buttonRenderer',
    },
    {
        headerName: 'ID',
        width: 85,
        field: 'totalId',
        cellClass: 'user-select-text',
        cellClassRules,
    },
    {
        headerName: '매체',
        width: 100,
        field: 'sourceName',
        tooltipField: 'sourceName',
        cellRenderer: 'longTextRenderer',
    },
    {
        headerName: '제목',
        field: 'unescapeTitle',
        width: 186,
        flex: 1,
        tooltipField: 'unescapeTitle',
        cellRenderer: 'longTextRenderer',
    },
    {
        headerName: '출고시간',
        width: 130,
        field: 'serviceDaytime',
        cellClassRules,
    },
];
