export const columnDefs = [
    {
        headerName: 'ID',
        field: 'datasetSeq',
        tooltipField: 'datasetSeq',
        width: 50,
    },
    {
        headerName: '데이터셋명',
        field: 'datasetName',
        tooltipField: 'datasetName',
        width: 190,
        flex: 1,
        cellClassRules: {
            'usedyn-n': (params) => params.data.usedYn === 'N',
        },
    },
    {
        headerName: '',
        field: 'autoCreateYn',
        width: 55,
        cellRendererFramework: (params) => {
            const { autoCreateYn } = params.data;
            const autoCreateText = autoCreateYn === 'Y' ? '자동형' : '편집형';
            return autoCreateText;
        },
    },
];
