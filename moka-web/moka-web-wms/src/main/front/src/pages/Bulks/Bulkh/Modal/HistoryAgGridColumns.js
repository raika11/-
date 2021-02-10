export const historyColumnDefs = [
    {
        headerName: '',
        field: 'bulkartSeq',
        width: 70,
        cellStyle: { fontSize: '12px', lineHeight: '23px' },
        headerClass: 'ag-grid-sns-meta-header',
    },
    {
        headerName: '작업일시',
        headerClass: 'ag-grid-sns-meta-header',
        field: 'regDt',
        width: 90,
        flex: 1,
        cellStyle: { fontSize: '12px', lineHeight: '23px' },
    },
    {
        headerName: '작업자',
        field: 'regId',
        headerClass: 'ag-grid-sns-meta-header',
        width: 80,
        cellStyle: { fontSize: '12px', lineHeight: '23px' },
    },
    {
        headerName: 'ID',
        field: 'regId',
        headerClass: 'ag-grid-sns-meta-header',
        width: 80,
    },
];

export const historyDetailColumnDefs = [
    {
        headerName: '순서',
        field: 'ordNo',
        width: 70,
        cellStyle: { fontSize: '12px', lineHeight: '23px' },
        headerClass: 'ag-grid-sns-meta-header',
    },
    {
        headerName: '기사제목',
        headerClass: 'ag-grid-sns-meta-header',
        field: 'title',
        width: 90,
        flex: 1,
        cellStyle: { fontSize: '12px', lineHeight: '23px' },
    },
    {
        headerName: '기사ID',
        field: 'totalId',
        headerClass: 'ag-grid-sns-meta-header',
        width: 80,
        cellStyle: { fontSize: '12px', lineHeight: '23px', paddingTop: '8px' },
    },
];
