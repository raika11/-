export default [
    {
        headerName: '번호',
        field: 'tourSeq',
        width: 50,
    },
    {
        headerName: '견학일',
        field: 'tourDate',
        width: 100,
    },
    {
        headerName: '단체명',
        field: 'tourGroupNm',
        width: 300,
        tooltipField: 'tourGroupNm',
        flex: 1,
    },
    {
        headerName: '인원',
        field: 'tourPersons',
        width: 40,
    },
    {
        headerName: '신청자',
        field: 'writerNm',
        width: 60,
        tooltipField: 'writerNm',
    },
    {
        headerName: '연락처',
        field: 'writerPhone',
        width: 120,
    },
    {
        headerName: '상태',
        field: 'tourStatus',
        width: 50,
        cellRendererFramework: ({ data }) => {
            let status = '';
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
        width: 100,
    },
];
