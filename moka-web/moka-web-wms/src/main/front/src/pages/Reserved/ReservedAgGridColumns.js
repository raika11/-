export const columnDefs = [
    {
        headerName: '예약어',
        field: 'reservedId',
        width: 120,
        tooltipField: 'reservedId',
    },
    {
        headerName: '값',
        field: 'reservedValue',
        flex: 1,
        width: 145,
        tooltipField: 'reservedValue',
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 40,
        cellRenderer: 'usedYnRenderer',
    },
];
