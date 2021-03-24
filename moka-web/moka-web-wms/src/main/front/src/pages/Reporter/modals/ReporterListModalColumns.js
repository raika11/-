export default [
    {
        headerName: '',
        field: 'add',
        width: 60,
        cellRenderer: 'buttonRenderer',
    },
    {
        headerName: '번호',
        field: 'repSeq',
        width: 60,
    },
    {
        headerName: '아이디',
        field: 'joinsId',
        width: 100,
        tooltipField: 'joinsId',
    },
    {
        headerName: '사진',
        field: 'repImg',
        width: 50,
        cellRenderer: 'imageRenderer',
    },
    {
        headerName: '이름',
        field: 'repName',
        width: 75,
    },
    {
        headerName: '소속',
        field: 'belong',
        width: 200,
        tooltipField: 'belong',
    },
    {
        headerName: '직책',
        field: 'repTitle',
        width: 100,
        tooltipField: 'repTitle',
    },
    {
        headerName: '이메일',
        field: 'repEmail1',
        width: 180,
        flex: 1,
        tooltipField: 'repEmail1',
    },
];
