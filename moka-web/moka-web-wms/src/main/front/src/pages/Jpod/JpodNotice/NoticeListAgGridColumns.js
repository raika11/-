export default [
    {
        headerName: '번호',
        field: 'boardSeq',
        width: 50,
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '채널명',
        field: 'chnlNm',
        width: 200,
        cellStyle: { display: 'flex', alignItems: 'center' },
        tooltipField: 'chnlNm',
    },
    {
        headerName: '제목',
        field: 'title',
        flex: 1,
        tooltipField: 'title',
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '등록자',
        field: 'regInfo',
        width: 100,
        cellStyle: { display: 'flex', alignItems: 'center' },
        tooltipField: 'regInfo',
    },
    {
        headerName: '작성일자',
        field: 'regDt',
        width: 140,
        cellStyle: { display: 'flex', alignItems: 'center' },
        tooltipField: 'regDt',
    },
    {
        headerName: '조회',
        field: 'viewCnt',
        width: 50,
        cellStyle: { display: 'flex', alignItems: 'center' },
        tooltipField: 'viewCnt',
    },
];
