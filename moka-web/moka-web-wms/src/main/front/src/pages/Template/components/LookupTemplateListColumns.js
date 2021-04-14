export default [
    {
        headerName: 'ID',
        field: 'templateSeq',
        width: 50,
    },
    {
        headerName: '템플릿명',
        field: 'templateName',
        width: 155,
        flex: 1,
        tooltipField: 'templateName',
    },
    {
        headerName: '위치그룹',
        field: 'templateGroupName',
        width: 75,
        tooltipField: 'templateGroupName',
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
