export default [
    {
        colId: 'checkbox',
        headerName: '선택',
        width: 30,
        checkboxSelection: true,
        suppressMenu: true,
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
            lineHeight: '21px',
            fontSize: '12px',
            height: '100%',
            display: '-webkit-box',
            paddingTop: '5px',
            '-webkit-line-clamp': 3,
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
        cellClassRules: {
            'ft-12': () => true,
        },
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 83,
        cellClassRules: {
            'pre-wrap-cell': () => true,
        },
        cellStyle: {
            lineHeight: '20px',
        },
    },
    {
        headerName: '옵션',
        width: 83,
        cellRenderer: 'optionRenderer',
        cellStyle: {
            lineHeight: '22px',
            fontSize: '12px',
            height: '66px',
        },
    },
];
