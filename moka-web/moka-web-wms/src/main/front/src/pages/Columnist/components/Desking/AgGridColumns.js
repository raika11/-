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
        headerName: 'seqNo',
        field: 'seqNo',
        width: 1,
        hide: true,
    },
    {
        headerName: '기자번호',
        field: 'repSeq',
        width: 65,
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
        headerName: '상태정보',
        field: 'status',
        width: 63,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '약력정보',
        field: 'profile',
        width: 400,
        flex: 1,
        tooltipField: 'profile',
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 140,
        tooltipField: 'regDt',
    },
];
