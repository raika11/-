export const columnDefs = [
    {
        headerName: '번호',
        field: 'boardId',
        width: 50,
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '채널명',
        field: 'chnlNm',
        width: 200,
        cellStyle: { display: 'flex', alignItems: 'center' },
        tooltipField: 'chnlNm',
    },
    {
        headerName: '제목',
        field: 'title',
        width: 100,
        flex: 1,
        tooltipField: 'title',
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '작성자',
        field: 'regName',
        width: 100,
        cellStyle: { display: 'flex', alignItems: 'center' },
        tooltipField: 'regName',
    },
    {
        headerName: '작성일자',
        field: 'regDt',
        width: 150,
        cellStyle: { display: 'flex', alignItems: 'center' },
        tooltipField: 'regDt',
    },
    {
        headerName: '조회',
        field: 'viewCnt',
        width: 80,
        cellStyle: { display: 'flex', alignItems: 'center' },
        tooltipField: 'viewCnt',
    },
];
