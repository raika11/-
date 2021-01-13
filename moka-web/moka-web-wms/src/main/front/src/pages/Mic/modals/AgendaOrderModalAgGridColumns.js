export default [
    {
        headerName: '',
        rowDrag: true,
        width: 24,
    },
    {
        headerName: '',
        field: 'orderNm',
        width: 24,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '아젠다명',
        field: 'agenda',
        cellStyle: { fontSize: '12px' },
        flex: 1,
    },
];

export const rowData = [
    { agenda: '노트르담 대성당' },
    { agenda: '전구~욱 손주자랑!' },
    { agenda: '인생환승역 개통 이벤트' },
    { agenda: '촛불 1년, 그 후' },
    { agenda: '산업자본 은행 진출' },
];
