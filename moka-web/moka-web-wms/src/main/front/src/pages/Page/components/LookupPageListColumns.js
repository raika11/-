export const columnDefs = [
    {
        headerName: 'ID',
        field: 'pageSeq',
        width: 50,
    },
    {
        headerName: '페이지명',
        field: 'pageName',
        flex: 1,
        width: 190,
        tooltipField: 'pageName',
    },
    {
        headerName: '',
        field: 'load',
        width: 33,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: { iconButton: true, iconName: 'fal-file-import', clickFunctionName: 'handleClickLoad', overlayText: '불러오기' },
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

export default columnDefs;
