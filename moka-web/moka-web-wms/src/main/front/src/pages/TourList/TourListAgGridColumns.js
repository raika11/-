export default [
    {
        headerName: '번호',
        field: 'seqNo',
        cellStyle: { fontSize: '12px' },
        width: 80,
    },
    {
        headerName: '견학일',
        field: 'date',
        cellStyle: { fontSize: '12px' },
        width: 80,
    },
    {
        headerName: '단체명',
        field: 'groupName',
        cellStyle: { fontSize: '12px' },
        width: 300,
        tooltipField: 'groupName',
        flex: 1,
    },
    {
        headerName: '인원',
        field: 'people',
        cellStyle: { fontSize: '12px' },
        width: 40,
    },
    {
        headerName: '신청자',
        field: 'applicant',
        cellStyle: { fontSize: '12px' },
        width: 60,
    },
    {
        headerName: '연락처',
        field: 'phone',
        cellStyle: { fontSize: '12px' },
        width: 100,
    },
    {
        headerName: '상태',
        field: 'state',
        cellStyle: { fontSize: '12px' },
        width: 50,
    },
    {
        headerName: '등록일',
        field: 'regDt',
        cellStyle: { fontSize: '12px' },
        width: 80,
    },
];

export const rowData = [
    {
        seqNo: '158',
        date: '2020-12-01',
        groupName: '중앙대학교사범대학부속고등학교 시사언론',
        people: '12',
        applicant: '테스트',
        phone: '010-0358-1254',
        state: '승인',
        regDt: '2020-11-21',
    },
];
