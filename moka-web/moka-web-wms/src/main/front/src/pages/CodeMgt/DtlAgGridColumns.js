import { GRID_LINE_HEIGHT } from '@/style_constants';

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.T[1]}px`,
};

export default [
    {
        headerName: '코드',
        field: 'dtlCd',
        width: 180,
        tooltipField: 'dtlCd',
        cellStyle,
    },
    {
        headerName: '코드명',
        field: 'cdNm',
        width: 150,
        tooltipField: 'cdNm',
        cellStyle,
    },
    {
        headerName: '영문명',
        field: 'cdEngNm',
        width: 180,
        tooltipField: 'cdEngNm',
        cellStyle,
    },
    {
        headerName: '코드 설명',
        field: 'cdComment',
        width: 200,
        flex: 1,
        tooltipField: 'cdComment',
        cellStyle,
    },
    {
        headerName: '수정자\n수정일시',
        field: 'workInfo',
        width: 130,
        cellClassRules: {
            'ag-pre-cell': () => true,
        },
        tooltipField: 'worker',
        cellStyle: { lineHeight: `${GRID_LINE_HEIGHT.M}px` },
    },
    {
        headerName: '순서',
        field: 'cdOrd',
        width: 40,
        cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 40,
        cellRenderer: 'usedYnRenderer',
    },
];
