export default [
    {
        headerName: '로그 ID',
        field: 'orgSourceName',
        width: 100,
        cellStyle: {},
    },
    {
        headerName: '포털',
        field: 'contentId',
        width: 80,
        cellStyle: {},
    },
    {
        headerName: 'IUD',
        field: 'iud',
        cellStyle: {},
        width: 60,
        tooltipField: 'title',
    },
    {
        headerName: '시작일시',
        field: 'startDt',
        width: 120,
        cellStyle: { textAlign: 'center' },
    },
    {
        headerName: '종료일시',
        field: 'endDt',
        width: 120,
        cellStyle: { textAlign: 'center' },
    },
    {
        headerName: '상태',
        field: 'status',
        width: 70,
        cellStyle: { textAlign: 'center' },
    },
];
