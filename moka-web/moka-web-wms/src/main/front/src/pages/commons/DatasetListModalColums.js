export default [
    { headerName: '', checkboxSelection: true, width: 35 },
    {
        headerName: 'ID',
        field: 'datasetSeq',
        width: 70,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '데이터셋명',
        field: 'datasetName',
        width: 364,
        flex: 1,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'datasetName',
    },
    {
        headerName: '데이터유형',
        field: 'autoCreateYnName',
        width: 90,
        cellStyle: { fontSize: '12px' },
    },
];
