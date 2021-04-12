import { GRID_LINE_HEIGHT } from '@/style_constants';

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.C[0]}px`,
};

export default [
    {
        rowDrag: true,
        width: 28,
        maxWidth: 28,
        suppressMenu: true,
        rowDragText: (params) => {
            return params.rowNode.data.pkgTitle;
        },
        cellStyle,
    },
    {
        headerName: 'ID',
        width: 55,
        field: 'pkgSeq',
        cellClass: 'user-select-text',
        cellStyle,
    },
    {
        headerName: '카테고리',
        width: 110,
        field: 'catName',
        tooltipField: 'catName',
        cellStyle,
    },
    {
        headerName: '유형',
        width: 80,
        field: 'divName',
        cellStyle,
    },
    {
        headerName: '패키지명',
        width: 200,
        flex: 1,
        field: 'pkgTitle',
        tooltipField: 'pkgTitle',
        cellStyle,
    },
    {
        headerName: '기자정보',
        field: 'repName',
        width: 110,
        tooltipField: 'fullRepName',
        cellStyle,
    },
    {
        headerName: '기사수',
        width: 70,
        field: 'artCnt',
        cellStyle,
    },
    {
        headerName: '패키지 생성일',
        width: 100,
        field: 'regDt',
        cellStyle,
    },
    {
        headerName: '종료여부',
        width: 63,
        field: 'usedYn',
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '',
        width: 64,
        field: '정보',
        cellRenderer: 'buttonRenderer',
    },
];
