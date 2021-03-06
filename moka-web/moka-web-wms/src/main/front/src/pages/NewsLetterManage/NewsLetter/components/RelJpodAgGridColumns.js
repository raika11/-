export default [
    {
        headerName: '',
        field: 'add',
        width: 60,
        cellRenderer: 'buttonRenderer',
    },
    {
        headerName: 'ID',
        field: 'chnlSeq',
        width: 50,
    },
    {
        headerName: '채널명',
        field: 'chnlNm',
        flex: 1,
        tooltipField: 'chnlNm',
    },
    {
        headerName: '뉴스레터 여부',
        field: 'letterYn',
        width: 90,
        cellRenderer: 'usedYnRenderer',
    },
];
