export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };
export const columnDefs = [
    {
        headerName: 'ID',
        field: 'chnlSeq',
        width: 50,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '개설일',
        field: 'chnlSdt',
        width: 90,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'chnlSdt',
    },
    {
        headerName: '이미지',
        field: 'chnlThumb',
        width: 90,
        cellRenderer: 'imageRenderer',
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        // autoHeight: true,
    },
    {
        headerName: '채널명',
        field: 'chnlNm',
        width: 150,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'chnlNm',
    },
    {
        headerName: '설명',
        field: 'chnlMemo',
        width: 100,
        flex: 1,
        tooltipField: 'chnlMemo',
        autoHeight: true,
        cellStyle: {
            boxSizing: 'border-box',
            whiteSpace: 'normal',
            lineHeight: '20px',
            fontSize: '14px',
            height: '50px',
            display: '-webkit-box',
            paddingTop: '5px',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            cursor: 'pointer',
        },
    },
    {
        headerName: '\t사용',
        field: 'usedYn',
        width: 80,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '회차',
        field: 'roundinfo',
        width: 100,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'roundinfo',
    },
    {
        headerName: '구독',
        field: 'subscribe',
        width: 90,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'subscribe',
    },
];

export const channelEpisodeColumnDefs = [
    {
        headerName: 'ID',
        field: 'epsdSeq',
        width: 50,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '회차',
        field: 'epsdNo',
        width: 50,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '에피소드 명',
        field: 'epsdNm',
        width: 100,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '설명',
        field: 'epsdMemo',
        width: 100,
        flex: 1,
        tooltipField: 'epsdMemo',
        autoHeight: true,
        cellStyle: {
            boxSizing: 'border-box',
            whiteSpace: 'normal',
            lineHeight: '20px',
            fontSize: '14px',
            height: '50px',
            display: '-webkit-box',
            paddingTop: '5px',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            cursor: 'pointer',
        },
    },
    {
        headerName: '방송일',
        field: 'epsdDate',
        width: 100,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '재생시간',
        field: 'playTime',
        width: 100,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 80,
        cellRenderer: 'usedYnRenderer',
    },
];
