export default [
    {
        headerName: '코드',
        field: 'dtlCd',
        width: 180,
        tooltipField: 'dtlCd',
        cellStyle: { lineHeight: '40px' },
    },
    {
        headerName: '코드명',
        field: 'cdNm',
        width: 150,
        tooltipField: 'cdNm',
        cellStyle: { lineHeight: '40px' },
    },
    {
        headerName: '영문명',
        field: 'cdEngNm',
        width: 180,
        tooltipField: 'cdEngNm',
        cellStyle: { lineHeight: '40px' },
    },
    {
        headerName: '코드 설명',
        field: 'cdComment',
        width: 200,
        flex: 1,
        tooltipField: 'cdComment',
        cellStyle: { lineHeight: '40px' },
    },
    {
        headerName: '수정자\n수정일시',
        field: 'workInfo',
        width: 130,
        cellClassRules: {
            'pre-cell': () => true,
        },
        tooltipField: 'worker',
        cellStyle: { lineHeight: '21px' },
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
