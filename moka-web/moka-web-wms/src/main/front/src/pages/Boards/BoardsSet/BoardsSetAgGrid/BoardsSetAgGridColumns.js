export const ColumnDefs = [
    {
        headerName: '번호',
        field: 'boardId',
        width: 50,
    },
    {
        headerName: '게시판명',
        field: 'boardName',
        width: 180,
        flex: 1,
        tooltipField: 'boardName',
    },
    {
        headerName: '생성일',
        field: 'regDt',
        width: 130,
        tooltipField: 'regDt',
    },
    {
        headerName: '최종 업데이트 일시',
        field: 'regDt',
        width: 130,
        tooltipField: 'regDt',
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 40,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '',
        field: 'buttonInfo',
        width: 180,
        cellRenderer: 'buttonRenderer',
    },
];
