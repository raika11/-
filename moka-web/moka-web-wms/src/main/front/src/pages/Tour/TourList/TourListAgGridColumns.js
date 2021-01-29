export default [
    {
        headerName: '번호',
        field: 'tourSeq',
        cellStyle: { fontSize: '12px' },
        width: 50,
    },
    {
        headerName: '견학일',
        field: 'tourDate',
        cellStyle: { fontSize: '12px' },
        width: 80,
    },
    {
        headerName: '단체명',
        field: 'tourGroupNm',
        cellStyle: { fontSize: '12px' },
        width: 300,
        tooltipField: 'tourGroupNm',
        flex: 1,
    },
    {
        headerName: '인원',
        field: 'tourPersons',
        cellStyle: { fontSize: '12px' },
        width: 40,
    },
    {
        headerName: '신청자',
        field: 'writerNm',
        cellStyle: { fontSize: '12px' },
        width: 60,
        tooltipField: 'writerNm',
    },
    {
        headerName: '연락처',
        field: 'writerPhone',
        cellStyle: { fontSize: '12px' },
        width: 100,
    },
    {
        headerName: '상태',
        field: 'tourStatus',
        cellStyle: { fontSize: '12px' },
        width: 50,
        cellRendererFramework: ({ data }) => {
            let status;
            if (data.tourStatus === 'S') {
                status = '신청';
            } else if (data.tourStatus === 'A') {
                status = '승인';
            } else if (data.tourStatus === 'R') {
                status = '반려';
            } else if (data.tourStatus === 'C') {
                status = '취소';
            }

            return status;
        },
    },
    {
        headerName: '등록일',
        field: 'regDt',
        cellStyle: { fontSize: '12px' },
        width: 80,
    },
];
