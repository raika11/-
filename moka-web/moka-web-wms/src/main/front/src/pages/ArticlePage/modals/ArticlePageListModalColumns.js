export default [
    { headerName: '', checkboxSelection: true, width: 35 },
    {
        headerName: 'ID',
        field: 'datasetSeq',
        width: 70,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '뷰스킨명',
        field: 'skinName',
        width: 333,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'skinName',
    },
    {
        headerName: '뷰스킨 서비스명',
        field: 'skinServiceName',
        width: 120,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'skinServiceName',
    },
];
