export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };

export const columnDefs = [
    {
        colId: 'checkbox',
        width: 24,
        checkboxSelection: true,
        suppressMenu: true,
        headerCheckboxSelection: true,
        cellStyle: { width: '24px' },
    },
    {
        headerName: '신고',
        field: 'report',
        tooltipField: 'report',
        width: 60,
    },
    {
        headerName: 'ID',
        field: 'commentSeq',
        tooltipField: 'commentSeq',
        width: 100,
    },
    {
        headerName: '댓글내용',
        field: 'comment',
        tooltipField: 'comment',
        width: 200,
        flex: 1,
    },
    {
        headerName: '사용자ID',
        field: 'userId',
        tooltipField: 'userId',
        width: 140,
    },
    {
        headerName: '이름',
        field: 'userName',
        width: 100,
    },
    {
        headerName: '등록IP',
        field: 'ip',
        tooltipField: 'ip',
        width: 100,
    },
    {
        headerName: '계정',
        field: 'source',
        tooltipField: 'source',
        width: 100,
    },
    {
        headerName: '등록일시',
        field: 'regDt',
        tooltipField: 'regDt',
        width: 150,
    },
    {
        headerName: '정보',
        field: 'recommend',
        tooltipField: 'recommend',
        width: 100,
    },
    {
        headerName: '상태',
        field: 'status',
        tooltipField: 'status',
        width: 100,
    },
    {
        headerName: '매체',
        field: 'media',
        tooltipField: 'media',
        width: 150,
    },
];
