export const columnDefs = [
    {
        headerName: '',
        field: 'successYn',
        width: 35,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '로그ID',
        field: 'seqNo',
        cellStyle: { fontSize: '12px' },
        width: 70,
        tooltipField: 'seqNo',
    },
    {
        headerName: '메뉴명',
        field: 'menuNm',
        cellStyle: { fontSize: '12px' },
        flex: 1,
        tooltipField: 'menuNm',
    },
    {
        headerName: '액션명',
        field: 'action',
        cellStyle: { fontSize: '12px' },
        width: 80,
    },
    {
        headerName: '작업자ID',
        field: 'memberId',
        cellStyle: { fontSize: '12px' },
        width: 80,
        tooltipField: 'memberId',
    },
    {
        headerName: '작업자IP',
        field: 'regIp',
        cellStyle: { fontSize: '12px' },
        width: 105,
    },
    {
        headerName: '작업일',
        field: 'regDt',
        cellStyle: { fontSize: '12px' },
        width: 125,
    },
];
