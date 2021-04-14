import { GRID_LINE_HEIGHT } from '@/style_constants';

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.T[1]}px`,
};

export const columnDefs = [
    {
        headerName: 'ID',
        field: 'epsdSeq',
        width: 45,
        cellStyle,
        tooltipField: 'epsdSeq',
    },
    {
        headerName: '채널명',
        field: 'chnlNm',
        width: 120,
        cellStyle,
        tooltipField: 'chnlNm',
    },
    {
        headerName: '시즌',
        field: 'seasonNo',
        width: 55,
        cellStyle,
    },
    {
        headerName: '회차',
        field: 'epsdNo',
        width: 63,
        cellStyle,
        tooltipField: 'epsdNo',
    },
    {
        headerName: '에피소드명',
        field: 'epsdNm',
        flex: 1,
        cellRenderer: 'longTextRenderer',
        tooltipField: 'epsdNm',
    },
    {
        headerName: '설명',
        field: 'epsdMemo',
        width: 150,
        cellStyle,
    },
    {
        headerName: '방송일',
        field: 'epsdDate',
        width: 90,
        cellStyle,
        tooltipField: 'epsdDate',
    },
    {
        headerName: '재생시간',
        field: 'playTime',
        width: 70,
        cellStyle,
        tooltipField: 'playTime',
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 40,
        cellRenderer: 'usedYnRenderer',
    },
];
