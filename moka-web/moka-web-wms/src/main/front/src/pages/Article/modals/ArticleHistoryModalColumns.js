export default [
    {
        headerName: '수정시간',
        field: 'regDt',
        width: 73,
        autoHeight: true,
        wrapText: true,
        cellStyle: { lineHeight: '21px', fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '수정자',
        field: 'regId',
        width: 70,
        autoHeight: true,
        wrapText: true,
        cellStyle: { fontSize: '12px', lineHeight: '21px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '분류',
        field: 'masterCodeText',
        width: 130,
        autoHeight: true,
        wrapText: true,
        cellStyle: { lineHeight: '21px', fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '제목\n부제목',
        field: 'title',
        flex: 1,
        width: 150,
        autoHeight: true,
        wrapText: true,
        cellStyle: {
            lineHeight: '21px',
            display: 'flex',
            alignItems: 'center',
        },
    },
    {
        headerName: '기자',
        field: 'artReporter',
        width: 90,
        autoHeight: true,
        wrapText: true,
        cellStyle: { fontSize: '12px', lineHeight: '21px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '태그',
        field: 'keywordList',
        width: 90,
        autoHeight: true,
        wrapText: true,
        cellStyle: { fontSize: '12px', lineHeight: '21px', display: 'flex', alignItems: 'center' },
    },
];
