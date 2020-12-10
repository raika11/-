export default [
    {
        colId: 'radiobutton',
        width: 28,
        // checkboxSelection: true,
        suppressMenu: true,
        // headerCheckboxSelection: true,
        cellStyle: { width: '28px' },
    },
    {
        headerName: '이미지',
        width: 60,
        field: 'thumbFileName',
        cellRenderer: 'imageRenderer',
    },
    {
        headerName: '제목',
        field: 'name',
        width: 186,
        flex: 1,
        autoHeight: true,
        tooltipField: 'name',
        cellStyle: {
            boxSizing: 'border-box',
            whiteSpace: 'normal',
            lineHeight: '20px',
            fontSize: '14px',
            height: '50px',
            display: '-webkit-box',
            paddingTop: '5px',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            cursor: 'pointer',
        },
    },
    {
        headerName: '상태',
        field: 'stateText',
        width: 40,
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
        },
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 80,
        cellClassRules: {
            'pre-wrap-cell': () => true,
        },
        cellStyle: {
            lineHeight: '20px',
        },
    },
    {
        headerName: '옵션',
        width: 75,
    },
];