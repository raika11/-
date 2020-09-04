export const apiSearchTypes = [
    { id: 'all', name: '전체' },
    { id: 'idLike', name: 'API명' },
    { id: 'description', name: 'API설명' }
];

export const apiSearchColumns = [
    {
        id: 'datasetRadio',
        format: 'radio',
        sort: false,
        disablePadding: true,
        label: '',
        width: 52, // radio는 width가 먹히지 않음
        align: 'center'
    },
    {
        id: 'apiId',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'API 명',
        width: 170,
        align: 'left'
    },
    {
        id: 'description',
        format: '',
        sort: false,
        disablePadding: true,
        label: '설명',
        width: 220,
        align: 'left'
    }
];
