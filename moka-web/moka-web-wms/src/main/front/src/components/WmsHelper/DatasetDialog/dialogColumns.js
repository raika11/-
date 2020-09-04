export const datasetColumns = [
    {
        id: 'radio',
        format: 'radio',
        sort: false,
        disablePadding: true,
        label: '',
        width: 40, // radio는 width가 먹히지 않음
        align: 'center'
    },
    {
        id: 'datasetSeq',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'ID',
        width: 70,
        align: 'left'
    },
    {
        id: 'datasetName',
        format: '',
        sort: false,
        disablePadding: true,
        label: '데이터셋명',
        width: 230,
        align: 'left'
    },
    {
        id: 'autoCreateYn',
        format: '',
        sort: false,
        disablePadding: true,
        label: '데이터유형',
        width: 70,
        align: 'center'
    }
];
