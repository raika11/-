export default [
    {
        headerName: 'ID',
        field: 'componentSeq',
        width: 50,
    },
    {
        headerName: '컴포넌트명',
        field: 'componentName',
        width: 165,
        flex: 1,
        tooltipField: 'componentName',
        cellClassRules: {
            'usedyn-n': (params) => params.data.viewYn === 'N',
        },
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
