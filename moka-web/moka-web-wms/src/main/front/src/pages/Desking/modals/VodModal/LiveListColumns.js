export default [
    {
        colId: 'checkbox',
        width: 30,
        minWidth: 30,
        checkboxSelection: true,
        suppressMenu: true,
    },
    {
        headerName: '채널명',
        field: 'liveTitle',
        width: 100,
        flex: 1,
        autoHeight: true,
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
        },
    },
    {
        headerName: '송출상태',
        field: 'stateText',
        width: 64,
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
        },
    },
    {
        headerName: '미리보기',
        field: 'preview',
        width: 60,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: { iconButton: true, iconName: 'fal-file-search', clickFunctionName: 'handleClickPreview' },
    },
    {
        headerName: '옵션',
        colId: 'options',
        width: 170,
        cellRenderer: 'optionRenderer',
        cellStyle: {
            lineHeight: '20px',
        },
    },
];
