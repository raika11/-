export default [
    {
        headerName: 'ID',
        field: 'adSeq',
        width: 50,
    },
    {
        headerName: '광고명',
        field: 'adNm',
        width: 155,
        flex: 1,
        tooltipField: 'adNm',
    },
    {
        headerName: '',
        field: 'append',
        width: 33,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: { iconButton: true, iconName: 'fal-file-plus', clickFunctionName: 'handleClickAppend', overlayText: '태그삽입' },
    },
    {
        headerName: '',
        field: 'link',
        width: 33,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: { iconButton: true, iconName: 'fal-external-link', clickFunctionName: 'handleClickLink', overlayText: '새창열기' },
    },
];
