export const columnDefs = [
    {
        headerName: '',
        field: '선택',
        width: 58,
        cellRenderer: 'buttonRenderer',
    },
    {
        headerName: '제목',
        field: 'name',
        width: 250,
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
        width: 80,
        tooltipField: 'regDt',
    },
];
