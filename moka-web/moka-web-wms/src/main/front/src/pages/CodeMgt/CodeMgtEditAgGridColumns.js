export default [
    {
        headerName: '코드그룹',
        field: 'grpCd',
        width: 110,
        tooltipField: 'grpCd',
    },
    {
        headerName: '코드',
        field: 'dtlCd',
        flex: 1,
        width: 170,
        tooltipField: 'dtlCd',
    },
    {
        headerName: '코드명',
        field: 'cdNm',
        width: 130,
        tooltipField: 'cdNm',
    },
    {
        headerName: '영문명',
        field: 'cdEngNm',
        width: 132,
        tooltipField: 'cdEngNm',
    },
    {
        headerName: '비고',
        field: 'cdComment',
        width: 120,
        tooltipField: 'cdComment',
    },
    {
        headerName: '기타1',
        field: 'cdNmEtc1',
        width: 160,
        tooltipField: 'cdNmEtc1',
    },
    {
        headerName: '기타2',
        field: 'cdNmEtc2',
        width: 160,
        tooltipField: 'cdNmEtc2',
    },
    {
        headerName: '기타3',
        field: 'cdNmEtc3',
        width: 160,
        tooltipField: 'cdNmEtc3',
    },
    {
        headerName: '순서',
        field: 'cdOrd',
        width: 40,
    },
    {
        headerName: '사용여부',
        field: 'usedYn',
        width: 70,
        cellRenderer: 'usedYnRenderer',
    },
];
