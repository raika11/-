export const columnDefs = [
    {
        headerName: '',
        field: 'choice',
        width: 58,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: { text: '선택' },
    },
    {
        headerName: '제목',
        field: 'name',
        width: 200,
        flex: 1,
        tooltipField: 'name',
    },
    {
        headerName: '상태',
        field: 'stateText',
        width: 45,
        tooltipField: 'stateText',
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 175,
        tooltipField: 'regDt',
    },
];
