export default [
    {
        headerName: '',
        field: 'add',
        width: 60,
        cellRenderer: 'buttonRenderer',
    },
    {
        headerName: 'ID',
        field: 'seq',
        width: 50,
    },
    {
        headerName: '구분',
        field: 'cate',
        width: 50,
    },
    {
        headerName: '패키지 명',
        field: 'pkgTitle',
        flex: 1,
    },
    {
        headerName: '뉴스레터 여부',
        field: 'letterYn',
        width: 90,
        cellRenderer: 'usedYnRenderer',
    },
];
