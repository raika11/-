export default [
    {
        headerName: '번호',
        field: 'answSeq',
        width: 60,
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '내용',
        field: 'answMemo',
        cellStyle: { display: 'flex', alignItems: 'center', lineHeight: '21px', paddingTop: '3px', paddingBottom: '3px' },
        autoHeight: true,
        wrapText: true,
        flex: 1,
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 85,
        wrapText: true,
        cellStyle: { display: 'flex', alignItems: 'center', lineHeight: '21px' },
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 55,
        cellStyle: { display: 'flex', alignItems: 'center' },
        cellRenderer: 'switchRenderer',
    },
    {
        headerName: '최상단',
        field: 'answTop',
        width: 55,
        cellStyle: { display: 'flex', alignItems: 'center' },
        cellRenderer: 'switchRenderer',
    },
];
