const columnDefs = [
    {
        headerName: 'ID',
        field: 'containerSeq',
        width: 50,
    },
    {
        headerName: '컨테이너명',
        field: 'containerName',
        width: 240,
        flex: 1,
        tooltipField: 'containerName',
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

export const ctColumnDefs = [
    {
        headerName: 'ID',
        field: 'containerSeq',
        width: 50,
    },
    {
        headerName: '컨테이너명',
        field: 'containerName',
        width: 240,
        tooltipField: 'containerName',
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
        field: 'link',
        width: 33,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: { iconButton: true, iconName: 'fal-external-link', clickFunctionName: 'handleClickLink', overlayText: '새창열기' },
    },
];

export default columnDefs;
