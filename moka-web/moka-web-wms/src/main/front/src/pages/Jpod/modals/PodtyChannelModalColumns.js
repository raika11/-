export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };

export const columnDefs = [
    {
        headerName: '채널명',
        field: 'getCastName',
        width: 250,
        flex: 1,
        tooltipField: 'getCastName',
    },
    {
        headerName: '개설일',
        field: 'crtDt',
        width: 100,
        tooltipField: 'crtDt',
    },
    {
        headerName: '채널번호',
        field: 'castSrl',
        width: 80,
        tooltipField: 'castSrl',
    },
    {
        headerName: '총회차',
        field: 'trackCnt',
        width: 60,
        tooltipField: 'trackCnt',
    },
    {
        headerName: '분류',
        field: 'simpodCategory',
        width: 100,
        tooltipField: 'simpodCategory',
    },
    {
        headerName: '보기',
        field: '이동',
        width: 58,
        cellRenderer: 'buttonRenderer',
    },
];
