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
        width: 70,
        tooltipField: 'seqNo',
    },
    {
        headerName: '메뉴명',
        field: 'menuNm',
        flex: 1,
        tooltipField: 'menuNm',
    },
    {
        headerName: '액션명',
        field: 'action',
        width: 70,
    },
    {
        headerName: '작업자ID',
        field: 'memberId',
        width: 80,
        tooltipField: 'memberId',
    },
    {
        headerName: '작업자IP',
        field: 'regIp',
        width: 117,
    },
    {
        headerName: '작업일',
        field: 'regDt',
        width: 142,
    },
];
