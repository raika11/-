export default [
    { headerName: '', checkboxSelection: true, width: 35 },
    {
        headerName: 'ID',
        field: 'partSeq',
        width: 70,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '폼명',
        field: 'formName',
        width: 150,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'formName',
    },
    {
        headerName: '파트제목',
        field: 'partTitle',
        width: 244,
        flex: 1,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'partTitle',
    },
];
