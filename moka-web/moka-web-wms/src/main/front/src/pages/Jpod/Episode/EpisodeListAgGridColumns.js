export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };
export const columnDefs = [
    {
        headerName: 'ID',
        field: 'epsdSeq',
        width: 45,
        cellStyle: { lineHeight: '43px' },
        tooltipField: 'epsdSeq',
    },
    {
        headerName: '채널명',
        field: 'chnlNm',
        width: 120,
        cellStyle: { lineHeight: '43px' },
        tooltipField: 'chnlNm',
    },
    {
        headerName: '시즌',
        field: 'seasonNo',
        width: 55,
        cellStyle: { lineHeight: '43px' },
    },
    {
        headerName: '회차',
        field: 'epsdNo',
        width: 63,
        cellStyle: { lineHeight: '43px' },
        tooltipField: 'epsdNo',
    },
    {
        headerName: '에피소드명',
        field: 'epsdNm',
        width: 120,
        flex: 1,
        autoHeight: true,
        cellStyle: {
            boxSizing: 'border-box',
            whiteSpace: 'normal',
            lineHeight: '18px',
            height: '43px',
            display: '-webkit-box',
            paddingTop: '3px',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            cursor: 'pointer',
        },
        tooltipField: 'epsdNm',
    },
    {
        headerName: '설명',
        field: 'epsdMemo',
        width: 150,
        cellStyle: { lineHeight: '43px' },
    },
    {
        headerName: '방송일',
        field: 'epsdDate',
        width: 90,
        cellStyle: { lineHeight: '43px' },
        tooltipField: 'epsdDate',
    },
    {
        headerName: '재생시간',
        field: 'playTime',
        width: 70,
        cellStyle: { lineHeight: '43px' },
        tooltipField: 'playTime',
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 40,
        cellRenderer: 'usedYnRenderer',
    },
];
