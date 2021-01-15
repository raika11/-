export default [
    {
        headerName: '단계',
        field: 'progress',
        width: 130,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: 'loader',
        field: 'loader',
        width: 110,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: 'dump',
        field: 'dump',
        width: 100,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: 'sender',
        field: 'sender',
        cellStyle: { fontSize: '12px' },
        children: [
            {
                headerName: '네이버',
                field: 'naver',
                width: 80,
                cellStyle: { fontSize: '12px' },
            },
            {
                headerName: '다음',
                field: 'daum',
                width: 80,
                cellStyle: { fontSize: '12px' },
            },
            {
                headerName: '네이트',
                field: 'nate',
                width: 80,
                cellStyle: { fontSize: '12px' },
            },
            {
                headerName: '줌',
                field: 'zoom',
                width: 80,
                cellStyle: { fontSize: '12px' },
            },
        ],
    },
];

export const rowData = [
    {
        progress: '대기',
        loader: '0',
        dump: '0',
        naver: '0',
        daum: '0',
        nate: '0',
        zoom: '0',
    },
];
