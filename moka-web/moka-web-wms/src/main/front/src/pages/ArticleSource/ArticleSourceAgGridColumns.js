export default [
    {
        headerName: '매체코드',
        field: 'sourceCode',
        cellStyle: { fontSize: '12px' },
        width: 65,
    },
    {
        headerName: '매체명',
        field: 'sourceName',
        cellStyle: { fontSize: '12px' },
        width: 90,
        tooltipField: 'sourceName',
    },
    {
        headerName: 'XML경로',
        field: 'cpXmlPath',
        cellStyle: { fontSize: '12px' },
        width: 125,
        flex: 1,
        tooltipField: 'cpXmlPath',
    },
    {
        headerName: '편집여부',
        field: 'artEditYn',
        width: 65,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: 'XML포맷 출처',
        field: 'joinsXmlFormat',
        cellStyle: { fontSize: '12px' },
        width: 93,
        cellRendererFramework: (params) => {
            const { joinsXmlFormat } = params.data;
            let joinsXmlText = 'CP업체';
            if (joinsXmlFormat === 'Y') {
                joinsXmlText = '조인스';
            }
            return joinsXmlText;
        },
    },
    {
        headerName: '이미지',
        field: 'receiveImgYn',
        cellStyle: { fontSize: '12px' },
        width: 50,
        cellRendererFramework: (params) => {
            const { receiveImgYn } = params.data;
            let receiveImgText = '업체';
            if (receiveImgYn === 'Y') {
                receiveImgText = '로컬';
            }
            return receiveImgText;
        },
    },
    {
        headerName: 'CP수신여부',
        field: 'rcvUsedYn',
        width: 80,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '벌크여부',
        field: 'bulkFlag',
        width: 65,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '등록일시',
        field: 'regDt',
        cellStyle: { fontSize: '12px' },
        width: 130,
    },
];
