export default [
    {
        headerName: 'NO',
        field: 'linkSeq',
        width: 50,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '제목',
        field: 'linkTitle',
        width: 160,
        flex: 1,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'linkTitle',
    },
    {
        headerName: 'URL',
        field: 'linkUrl',
        width: 100,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'linkUrl',
    },
    {
        headerName: '설명',
        field: 'linkContent',
        width: 200,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'linkContent',
    },
    {
        headerName: '대표이미지',
        field: 'imgUrl',
        width: 50,
    },
    {
        headerName: '게재여부',
        field: 'usedYnText',
        width: 50,
    },
];
