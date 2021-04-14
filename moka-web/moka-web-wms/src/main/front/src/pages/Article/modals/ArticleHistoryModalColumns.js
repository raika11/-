import { GRID_LINE_HEIGHT } from '@/style_constants';

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.M}px`,
};

const cellClassRules = {
    'custom-scroll': () => true,
    'user-select-text': () => true,
    'ag-center-cell': () => true,
    'ag-prewrap-cell': () => true,
};

export default [
    {
        headerName: '수정시간\n수정자',
        field: 'regData',
        width: 115,
        cellClassRules,
        cellStyle,
    },
    {
        headerName: '분류',
        field: 'masterCodeText',
        width: 130,
        cellClassRules,
        cellStyle,
    },
    {
        headerName: '제목\n부제목',
        field: 'artTitle',
        width: 560,
        cellRenderer: 'titleRenderer',
    },
    {
        headerName: '기자',
        field: 'artReporter',
        width: 100,
        wrapText: true,
        cellClassRules,
        tooltipField: 'artReporter',
        cellStyle,
    },
    {
        headerName: '태그',
        field: 'keywordList',
        flex: 1,
        width: 90,
        wrapText: true,
        cellClassRules,
        cellStyle,
    },
];
