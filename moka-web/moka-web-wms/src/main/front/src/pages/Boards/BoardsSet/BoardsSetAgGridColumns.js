import { GRID_LINE_HEIGHT } from '@/style_constants';

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.C[0]}px`,
};

export const columnDefs = [
    {
        headerName: '번호',
        field: 'boardId',
        width: 50,
        cellStyle,
    },
    {
        headerName: '게시판명',
        field: 'boardName',
        flex: 1,
        tooltipField: 'boardName',
        cellStyle,
    },
    {
        headerName: '생성일',
        field: 'regDt',
        width: 130,
        tooltipField: 'regDt',
        cellStyle,
    },
    {
        headerName: '최종 업데이트 일시',
        field: 'modDt',
        width: 130,
        tooltipField: 'modDt',
        cellStyle,
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 40,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '',
        field: 'buttonInfo',
        width: 180,
        cellRenderer: 'buttonRenderer',
    },
];
