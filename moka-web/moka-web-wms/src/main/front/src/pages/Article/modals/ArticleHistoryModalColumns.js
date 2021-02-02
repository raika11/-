const cellClassRules = {
    'custom-scroll': () => true,
    'user-select-text': () => true,
    'pre-wrap-cell': () => true,
};

export default [
    {
        headerName: '수정시간\n수정자',
        field: 'regData',
        width: 115,
        cellClassRules,
        cellStyle: { lineHeight: '21px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '분류',
        field: 'masterCodeText',
        width: 130,
        cellClassRules,
        cellStyle: { lineHeight: '21px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '제목\n부제목',
        field: 'artTitle',
        width: 560,
        cellRenderer: 'titleRenderer',
        cellStyle: { padding: '6px 0px' },
    },
    {
        headerName: '기자',
        field: 'artReporter',
        width: 100,
        wrapText: true,
        cellClassRules,
        tooltipField: 'artReporter',
        cellStyle: { lineHeight: '21px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '태그',
        field: 'keywordList',
        flex: 1,
        width: 90,
        wrapText: true,
        cellClassRules,
        cellStyle: { lineHeight: '21px', display: 'flex', alignItems: 'center' },
    },
];
