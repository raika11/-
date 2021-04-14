export const columnDefs = [
    {
        headerName: 'ID',
        field: 'artPageSeq',
        width: 50,
    },
    {
        headerName: '아티클페이지명',
        field: 'artPageName',
        flex: 1,
        tooltipField: 'artPageName',
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
];

export default columnDefs;
