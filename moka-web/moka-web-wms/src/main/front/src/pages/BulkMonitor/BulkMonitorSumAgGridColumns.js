export default [
    {
        headerName: '단계',
        field: 'status',
        cellStyle: { fontSize: '12px' },
        flex: 1,
    },
    {
        headerName: 'loader',
        field: 'loaderCnt',
        width: 70,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: 'dump',
        field: 'dumpCnt',
        width: 70,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: 'sender',
        field: 'sender',
        cellStyle: { fontSize: '12px' },
        children: [
            {
                headerName: '네이버',
                field: 'naverSenderCnt',
                width: 70,
                cellStyle: { fontSize: '12px' },
            },
            {
                headerName: '다음',
                field: 'daumSenderCnt',
                width: 70,
                cellStyle: { fontSize: '12px' },
            },
            {
                headerName: '네이트',
                field: 'nateSenderCnt',
                width: 70,
                cellStyle: { fontSize: '12px' },
            },
            {
                headerName: '줌',
                field: 'zoomSenderCnt',
                width: 70,
                cellStyle: { fontSize: '12px' },
            },
            {
                headerName: '언론 재단',
                field: 'kpfSenderCnt',
                width: 80,
                cellStyle: { fontSize: '12px' },
            },
            {
                headerName: '기타',
                field: 'remarkSenderCnt',
                width: 60,
                cellStyle: { fontSize: '12px' },
            },
        ],
    },
];
