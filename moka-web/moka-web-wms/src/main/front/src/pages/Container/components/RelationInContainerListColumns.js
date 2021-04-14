export default [
    {
        headerName: 'ID',
        field: 'containerSeq',
        width: 50,
    },
    {
        headerName: '컨테이너명',
        field: 'containerName',
        width: 276,
        flex: 1,
    },
    {
        headerName: '',
        field: 'link',
        width: 33,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: { iconButton: true, iconName: 'fal-external-link', clickFunctionName: 'handleClickLink', overlayText: '새창열기' },
    },
];
