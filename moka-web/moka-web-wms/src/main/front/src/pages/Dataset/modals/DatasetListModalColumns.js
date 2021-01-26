export default [
    { headerName: '', checkboxSelection: true, width: 35 },
    {
        headerName: 'ID',
        field: 'datasetSeq',
        width: 70,
    },
    {
        headerName: '데이터셋명',
        field: 'datasetName',
        width: 340,
        flex: 1,
        tooltipField: 'datasetName',
    },
    {
        headerName: '데이터유형',
        field: 'autoCreateYnName',
        width: 90,
    },
];
