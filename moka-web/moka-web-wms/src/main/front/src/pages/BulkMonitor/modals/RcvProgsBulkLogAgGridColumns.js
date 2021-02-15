export default [
    {
        headerName: '로그 ID',
        field: 'logSeq',
        width: 100,
        cellStyle: {},
    },
    {
        headerName: '포털',
        field: 'portalDiv',
        cellStyle: {},
        flex: 1,
        tooltipField: 'portalDiv',
    },
    {
        headerName: 'IUD',
        field: 'iud',
        cellStyle: {},
        width: 60,
    },
    {
        headerName: '시작일시',
        field: 'startDt',
        width: 150,
        cellStyle: { textAlign: 'center' },
    },
    {
        headerName: '종료일시',
        field: 'endDt',
        width: 150,
        cellStyle: { textAlign: 'center' },
    },
    {
        headerName: '상태',
        field: 'status',
        width: 70,
        cellStyle: { textAlign: 'center' },
    },
];
