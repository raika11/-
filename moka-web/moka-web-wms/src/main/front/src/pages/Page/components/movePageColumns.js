export const movePageSearchTypes = [
    { id: 'all', name: '전체' },
    { id: 'pageSeq', name: '페이지ID' },
    { id: 'pageName', name: '페이지명' },
    { id: 'pageServiceName', name: '서비스명' }
];

export const movePageColumns = [
    {
        id: 'pageRadio',
        format: 'radio',
        sort: false,
        disablePadding: true,
        label: '',
        width: 52, // radio는 width가 먹히지 않음
        align: 'center'
    },
    {
        id: 'pageSeq',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'ID',
        width: 62,
        align: 'left'
    },
    {
        id: 'pageName',
        format: '',
        sort: false,
        disablePadding: true,
        label: '페이지명',
        width: 118,
        align: 'left'
    },
    {
        id: 'pageUrl',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'URL',
        width: 182,
        align: 'left'
    }
];
