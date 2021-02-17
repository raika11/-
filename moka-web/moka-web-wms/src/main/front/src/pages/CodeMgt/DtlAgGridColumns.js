export default [
    {
        headerName: '코드',
        field: 'dtlCd',
        width: 180,
        tooltipField: 'dtlCd',
    },
    {
        headerName: '코드명',
        field: 'cdNm',
        width: 150,
        flex: 1,
        tooltipField: 'cdNm',
    },
    {
        headerName: '영문명',
        field: 'cdEngNm',
        width: 200,
        tooltipField: 'cdEngNm',
    },
    {
        headerName: '비고',
        field: 'cdComment',
        width: 150,
        tooltipField: 'cdComment',
    },
    {
        headerName: '작업자',
        field: 'worker',
        width: 130,
        tooltipField: 'worker',
    },
    {
        headerName: '순서',
        field: 'cdOrd',
        width: 40,
        cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 40,
        cellRenderer: 'usedYnRenderer',
    },
];
