export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };
export const columnDefs = [
    {
        headerName: 'ID',
        field: 'id',
        width: 120,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '제목',
        field: 'name',
        width: 250,
        flex: 1,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'name',
    },
    {
        headerName: '상태',
        field: 'state',
        width: 100,
        tooltipField: 'status',
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 80,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'regDt',
    },
];
