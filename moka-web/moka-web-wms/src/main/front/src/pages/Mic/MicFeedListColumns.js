import { GRID_LINE_HEIGHT, GRID_ROW_HEIGHT } from '@/style_constants';

const cellClassRules = {
    'ag-center-cell': () => true,
};

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.M}px`,
    paddingTop: '4px',
    paddingBottom: '4px',
};

export default [
    {
        headerName: '번호',
        field: 'answSeq',
        width: 60,
        cellClassRules,
    },
    {
        headerName: '내용',
        field: 'answMemo',
        cellClassRules,
        cellStyle: { ...cellStyle, minHeight: `${GRID_ROW_HEIGHT.T[1]}px` },
        wrapText: true,
        autoHeight: true,
        flex: 1,
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 88,
        cellClass: 'ag-pre-cell',
        cellStyle,
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 55,
        cellRenderer: 'switchRenderer',
    },
    {
        headerName: '최상단',
        field: 'answTop',
        width: 55,
        cellRenderer: 'switchRenderer',
    },
];
