import RelationPollAddBtn from './RelationPollAddBtn';

export const columnDefs = [
    {
        headerName: '',
        field: 'add',
        width: 60,
        cellRendererFramework: RelationPollAddBtn,
    },
    {
        headerName: 'ID',
        field: 'id',
        width: 70,
        cellStyle: { lineHeight: '65px' },
    },
    {
        headerName: '분류',
        field: 'category',
        width: 70,
        cellStyle: { lineHeight: '65px' },
    },
    {
        headerName: '투표 제목',
        field: 'title',
        width: 70,
        flex: 1,
        cellStyle: { lineHeight: '65px' },
        tooltipField: 'title',
    },
    {
        headerName: '상태',
        field: 'status',
        width: 70,
        cellStyle: { lineHeight: '65px' },
    },
];
