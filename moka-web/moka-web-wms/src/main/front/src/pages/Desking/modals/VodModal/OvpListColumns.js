export default [
    {
        colId: 'checkbox',
        width: 30,
        minWidth: 30,
        checkboxSelection: true,
        suppressMenu: true,
    },
    {
        headerName: '이미지',
        width: 60,
        cellStyle: { paddingTop: '14px', paddingBottom: '14px' },
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
            lineHeight: '22px',
            fontSize: '12px',
            height: '66px',
            display: '-webkit-box',
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
            'ft-12': () => true,
        },
        cellStyle: {
            lineHeight: '20px',
        },
    },
    {
        headerName: '옵션',
        colId: 'options',
        width: 83,
        cellRenderer: 'optionRenderer',
        cellStyle: {
            lineHeight: '22px',
            fontSize: '12px',
        },
        // valueGetter: (params) => {
        //     debugger;
        //     return params.getValue();
        // },
    },
];
