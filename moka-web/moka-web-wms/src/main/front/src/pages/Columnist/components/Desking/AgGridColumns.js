export default [
    {
        headerName: '',
        rowDrag: true,
        width: 24,
        minWidth: 24,
        rowDragText: (params) => {
            return params.rowNode.data.columnistNm;
        },
    },
    {
        headerName: '기자번호',
        field: 'repSeqText',
        width: 65,
    },
    {
        headerName: '타입코드',
        field: 'jplusRepDiv',
        width: 63,
    },
    {
        headerName: '사진',
        field: 'profilePhoto',
        width: 50,
        cellRenderer: 'circleImageRenderer',
    },
    {
        headerName: '기자이름',
        field: 'columnistNm',
        width: 70,
        tooltipField: 'columnistNm',
    },
    {
        headerName: '이메일',
        field: 'email',
        width: 200,
        tooltipField: 'email',
    },
    {
        headerName: '약력정보',
        field: 'profile',
        width: 300,
        flex: 1,
        tooltipField: 'profile',
    },
    {
        headerName: '사용여부',
        field: 'status',
        width: 63,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 140,
        tooltipField: 'regDt',
    },
];
