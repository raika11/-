export const historyColumnDefs = [
    {
        headerName: '',
        field: 'bulkartSeq',
        width: 70,
        headerClass: 'ag-grid-sns-meta-header',
    },
    {
        headerName: '작업일시',
        headerClass: 'ag-grid-sns-meta-header',
        field: 'regDt',
        width: 90,
        flex: 1,
    },
    {
        headerName: '등록자',
        field: 'regMember',
        headerClass: 'ag-grid-sns-meta-header',
        width: 150,
    },
];

export const historyDetailColumnDefs = [
    {
        headerName: '순서',
        field: 'ordNo',
        width: 70,
        headerClass: 'ag-grid-sns-meta-header',
    },
    {
        headerName: '기사제목',
        headerClass: 'ag-grid-sns-meta-header',
        field: 'title',
        width: 90,
        flex: 1,
    },
    {
        headerName: '기사ID',
        field: 'totalId',
        headerClass: 'ag-grid-sns-meta-header',
        width: 80,
    },
];
