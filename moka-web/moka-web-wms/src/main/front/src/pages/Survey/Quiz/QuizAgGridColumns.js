export const columnDefs = [
    {
        headerName: 'ID',
        field: 'quizSeq',
        width: 50,
    },
    {
        headerName: '퀴즈 제목',
        field: 'title',
        flex: 1,
        tooltipField: 'title',
    },
    {
        headerName: '등록자',
        field: 'regMemberInfo',
        width: 150,
        tooltipField: 'regMemberInfo',
    },
    {
        headerName: '저장일시',
        field: 'regDt',
        width: 125,
    },
    {
        headerName: '상태',
        field: 'quzStsText',
        width: 70,
        tooltipField: 'quzStsText',
    },
    {
        headerName: '참여',
        field: 'voteCnt',
        width: 50,
    },
];
