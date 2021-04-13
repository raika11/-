export default [
    {
        headerName: '번호',
        field: 'bnnrSeq',
        width: 40,
        flex: 1,
        cellClassRules: {
            'ag-center-cell': () => true,
        },
    },
    {
        headerName: '등록일시',
        field: 'regDt',
        width: 86,
        cellRenderer: 'longTextRenderer',
    },
    {
        headerName: '이미지',
        field: 'imgLink',
        width: 240,
        cellRenderer: 'imageRenderer',
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 48,
        cellRenderer: 'switchRenderer',
    },
];
