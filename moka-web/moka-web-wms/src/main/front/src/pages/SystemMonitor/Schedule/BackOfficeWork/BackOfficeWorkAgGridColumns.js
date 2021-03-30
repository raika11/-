export default [
    {
        headerName: '백오피스 업무',
        field: 'jobContent.jobNm',
        flex: 1,
    },
    {
        headerName: '예약 일시',
        field: 'reserveDt',
        width: 130,
    },
    {
        headerName: '시작 일시',
        field: 'startDt',
        width: 130,
    },
    {
        headerName: '종료 일시',
        field: 'endDt',
        width: 130,
    },
    {
        headerName: '상태',
        field: 'statusNm',
        width: 100,
    },
    {
        headerName: '작업 식별 정보',
        field: 'jobContent.jobCd',
        width: 130,
        tooltipField: 'jobContent.jobCd',
    },
];
