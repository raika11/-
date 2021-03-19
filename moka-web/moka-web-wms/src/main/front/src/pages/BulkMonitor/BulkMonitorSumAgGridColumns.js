export default [
    {
        headerName: '단계',
        field: 'status',
        cellStyle: {},
        width: 150,
    },
    {
        headerName: 'loader',
        field: 'loaderCnt',
        flex: 1,
        cellStyle: {},
    },
    {
        headerName: 'dump',
        field: 'dumpCnt',
        flex: 1,
        cellStyle: {},
    },
    {
        headerName: 'sender',
        field: 'sender',
        cellStyle: {},
        children: [
            {
                headerName: '네이버',
                field: 'naverSenderCnt',
                flex: 1,
                cellStyle: {},
            },
            {
                headerName: '다음',
                field: 'daumSenderCnt',
                flex: 1,
                cellStyle: {},
            },
            {
                headerName: '네이트',
                field: 'nateSenderCnt',
                flex: 1,
                cellStyle: {},
            },
            {
                headerName: '줌',
                field: 'zoomSenderCnt',
                flex: 1,
                cellStyle: {},
            },
            {
                headerName: '언론 재단',
                field: 'kpfSenderCnt',
                flex: 1,
                cellStyle: {},
            },
            {
                headerName: '기타',
                field: 'remarkSenderCnt',
                flex: 1,
                cellStyle: { textAlign: 'center' },
            },
        ],
    },
];
