export default [
    {
        headerName: '매체 코드',
        field: 'sourceCode',
        cellStyle: { fontSize: '12px' },
        width: 70,
    },
    {
        headerName: '매체(cp)명',
        field: 'sourceName',
        cellStyle: { fontSize: '12px' },
        width: 100,
    },
    {
        headerName: 'XML경로',
        field: 'cpXmlPath',
        cellStyle: { fontSize: '12px' },
        width: 150,
        tooltipField: 'cpXmlPath',
    },
    {
        headerName: '편집여부',
        field: 'artEditYn',
        cellStyle: { fontSize: '12px' },
        width: 70,
    },
    {
        headerName: 'XML포맷 출처',
        field: 'joinsXmlFormat',
        cellStyle: { fontSize: '12px' },
        width: 100,
    },
    {
        headerName: '이미지',
        field: 'receiveImgYn',
        cellStyle: { fontSize: '12px' },
        width: 70,
    },
    {
        headerName: '사용여부',
        field: 'joongangUse',
        cellStyle: { fontSize: '12px' },
        width: 70,
    },
    {
        headerName: '등록일시',
        field: 'regDt',
        cellStyle: { fontSize: '12px' },
        flex: 1,
    },
];
