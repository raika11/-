export default [
    {
        headerName: '기자번호',
        field: 'repSeq',
        width: 65,
    },
    {
        headerName: '기자이름',
        field: 'columnistNm',
        width: 100,
        tooltipField: 'columnistNm',
    },
    {
        headerName: '이메일',
        field: 'email',
        width: 200,
        tooltipField: 'email',
    },
    {
        headerName: '상태정보',
        field: 'status',
        width: 63,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '약력정보',
        field: 'profile',
        tooltipField: 'profile',
        width: 200,
        flex: 1,
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 130,
    },
];
