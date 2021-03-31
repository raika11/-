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
        field: 'repSeq',
        width: 65,
        cellStyle: { lineHeight: '43px', whiteSpace: 'pre-wrap' },
    },
    {
        headerName: '사진',
        field: 'profilePhoto',
        width: 50,
        cellRenderer: 'circleImageRenderer',
        cellStyle: { padding: '3px 6px' },
    },
    {
        headerName: '기자이름',
        field: 'columnistNm',
        width: 70,
        tooltipField: 'columnistNm',
        cellStyle: { lineHeight: '43px' },
    },
    {
        headerName: '이메일',
        field: 'email',
        width: 200,
        tooltipField: 'email',
        cellStyle: { lineHeight: '43px' },
    },
    {
        headerName: '약력정보',
        field: 'profile',
        width: 300,
        flex: 1,
        tooltipField: 'profile',
        cellStyle: { lineHeight: '43px' },
    },
    {
        headerName: '내/외부 필진',
        field: 'inoutText',
        width: 85,
        cellStyle: { lineHeight: '43px' },
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
        cellStyle: { lineHeight: '43px' },
    },
];
