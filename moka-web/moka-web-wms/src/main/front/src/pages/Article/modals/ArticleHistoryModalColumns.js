export default [
    {
        headerName: '수정시간',
        field: 'modifyDt',
        width: 80,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '수정자',
        field: 'modifier',
        width: 50,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '분류',
        field: 'categoryList',
        width: 70,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '제목\n부제목',
        field: 'title',
        flex: 1,
        width: 150,
        autoHeight: true,
        wrapText: true,
        cellStyle: {
            lineHeight: '20px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
        },
    },
    {
        headerName: '기자',
        field: 'reporterList',
        width: 70,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '태그',
        field: 'tagList',
        width: 70,
        cellStyle: { fontSize: '12px' },
    },
];
