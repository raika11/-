export const columnDefs = [
    {
        headerName: '',
        field: 'usedYn',
        width: 50,
        cellStyle: { textAlign: 'center' },
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '로그ID',
        field: 'seqNo',
        width: 50,
    },
    {
        headerName: '메뉴명',
        field: 'menuName',
        flex: 1,
    },
    {
        headerName: '액션명',
        field: 'action',
        width: 80,
    },
    {
        headerName: '작업자ID',
        field: 'memId',
        width: 80,
    },
    {
        headerName: '작업자IP',
        field: 'regIp',
        width: 130,
    },
    {
        headerName: '작업일',
        field: 'regDt',
        width: 130,
    },
];
