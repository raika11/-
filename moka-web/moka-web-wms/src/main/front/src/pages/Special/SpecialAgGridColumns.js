export const columnDefs = [
    {
        headerName: 'No',
        field: 'cdNo',
        width: 60,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'cdNo',
    },
    {
        headerName: '페이지 코드',
        field: 'pageCd',
        width: 100,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'pageCd',
    },
    {
        headerName: '제목',
        field: 'pageTitle',
        width: 315,
        flex: 1,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'pageTitle',
    },
    {
        headerName: '게시일',
        field: 'modDt',
        width: 100,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'modDt',
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 120,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'regDt',
    },
    {
        headerName: '노출',
        field: 'listYn',
        width: 50,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 50,
        cellStyle: { fontSize: '12px' },
    },
];

export const rowData = [
    {
        cdNo: '432',
        pageCd: '디지털AD',
        pageTitle: '달콤한 휴식을 할 수 있는 여행자가 갖춰야할 조건',
        modDt: '2020-09-09',
        regDt: '2020-09-09',
        listYn: 'N',
        usedYn: 'Y',
    },
];
