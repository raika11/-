import { GRID_LINE_HEIGHT } from '@/style_constants';

const cellClassRules = {
    'ag-center-cell': () => true,
};

export const columnDefs = [
    {
        headerName: 'ID',
        field: 'chnlSeq',
        width: 50,
        cellClassRules,
    },
    {
        headerName: '개설일',
        field: 'chnlSdt',
        width: 90,
        tooltipField: 'chnlSdt',
        cellClassRules,
    },
    {
        headerName: '이미지',
        field: 'chnlThumb',
        cellRenderer: 'fullImageRenderer',
        cellStyle: {
            paddingTop: '5px',
            paddingBottom: '5px',
        },
        width: 56,
    },
    {
        headerName: '채널명',
        field: 'chnlNm',
        width: 150,
        flex: 1,
        cellStyle: { lineHeight: `${GRID_LINE_HEIGHT.C[1]}px` },
        tooltipField: 'chnlNm',
    },
    {
        headerName: '설명',
        field: 'chnlMemo',
        width: 130,
        flex: 1,
        tooltipField: 'chnlMemo',
        cellRenderer: 'longTextRenderer',
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
        cellClassRules,
        tooltipField: 'roundinfo',
    },
    {
        headerName: '구독',
        field: 'subscribe',
        width: 42,
        cellClassRules,
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
