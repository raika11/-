export default [
    {
        headerName: 'ID',
        field: 'artPageSeq',
        width: 50,
    },
    {
        headerName: '아티클페이지명',
        field: 'artPageName',
        width: 240,
        flex: 1,
    },
    {
        headerName: '',
        field: 'preview',
        width: 33,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: { iconButton: true, iconName: 'fal-file-search', clickFunctionName: 'handleClickPreview', overlayText: '미리보기' },
    },
    {
        headerName: '',
        field: 'link',
        width: 33,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: { iconButton: true, iconName: 'fal-external-link', clickFunctionName: 'handleClickLink', overlayText: '새창열기' },
    },
];
