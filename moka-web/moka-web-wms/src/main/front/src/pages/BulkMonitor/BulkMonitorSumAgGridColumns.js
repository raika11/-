export default [
    {
        headerName: '단계',
        field: 'status',
        cellStyle: {},
        flex: 1,
    },
    {
        headerName: 'loader',
        field: 'loaderCnt',
        width: 70,
        cellStyle: {},
    },
    {
        headerName: 'dump',
        field: 'dumpCnt',
        width: 70,
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
                width: 70,
                cellStyle: {},
            },
            {
                headerName: '다음',
                field: 'daumSenderCnt',
                width: 70,
                cellStyle: {},
            },
            {
                headerName: '네이트',
                field: 'nateSenderCnt',
                width: 70,
                cellStyle: {},
            },
            {
                headerName: '줌',
                field: 'zoomSenderCnt',
                width: 70,
                cellStyle: {},
            },
            {
                headerName: '언론 재단',
                field: 'kpfSenderCnt',
                width: 70,
                cellStyle: {},
            },
            {
                headerName: '기타',
                field: 'remarkSenderCnt',
                width: 70,
                cellStyle: { textAlign: 'center' },
            },
        ],
    },
];
