export const columnDefs = [
    {
        headerName: 'ID',
        field: 'chnlSeq',
        width: 50,
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '개설일',
        field: 'chnlSdt',
        width: 90,
        cellStyle: { display: 'flex', alignItems: 'center' },
        tooltipField: 'chnlSdt',
    },
    {
        headerName: '이미지',
        field: 'chnlThumb',
        cellRenderer: 'imageRenderer',
        width: 56,
    },
    {
        headerName: '채널명',
        field: 'chnlNm',
        width: 150,
        flex: 1,
        cellStyle: { alignItems: 'center', lineHeight: '44px' },
        tooltipField: 'chnlNm',
    },
    {
        headerName: '설명',
        field: 'chnlMemo',
        width: 130,
        flex: 1,
        tooltipField: 'chnlMemo',
        cellStyle: {
            boxSizing: 'border-box',
            whiteSpace: 'normal',
            lineHeight: '20px',
            fontSize: '14px',
            display: '-webkit-box',
            paddingTop: '1px',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            cursor: 'pointer',
        },
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 40,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '회차',
        field: 'roundinfo',
        width: 42,
        cellStyle: { display: 'flex', alignItems: 'center' },
        tooltipField: 'roundinfo',
    },
    {
        headerName: '구독',
        field: 'subscribe',
        width: 42,
        cellStyle: { display: 'flex', alignItems: 'center' },
        tooltipField: 'subscribe',
    },
];

// 채널 > 에피소드 테이블
export const channelEpisodeColumnDefs = [
    {
        headerName: 'ID',
        field: 'epsdSeq',
        tooltipField: 'epsdSeq',
        width: 40,
    },
    {
        headerName: '시즌',
        field: 'seasonNo',
        width: 55,
    },
    {
        headerName: '회차',
        field: 'epsdNo',
        tooltipField: 'epsdNo',

        width: 60,
    },
    {
        headerName: '에피소드명',
        field: 'epsdNm',
        tooltipField: 'epsdNm',
        width: 130,
        flex: 1,
    },
    {
        headerName: '방송일',
        field: 'epsdDate',
        width: 90,
    },
    {
        headerName: '재생시간',
        field: 'playTime',
        width: 64,
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 40,
        cellRenderer: 'usedYnRenderer',
    },
];
