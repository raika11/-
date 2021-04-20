import { GRID_LINE_HEIGHT } from '@/style_constants';

const cellClassRules = {
    'ag-center-cell': () => true,
};

export default [
    {
        colId: 'checkbox',
        width: 24,
        checkboxSelection: true,
        cellClassRules,
    },
    {
        headerName: 'NO',
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
        cellRenderer: 'imageRenderer',
        cellRendererParams: { autoRatio: false },
        cellStyle: {
            paddingTop: '5px',
            paddingBottom: '5px',
        },
        width: 56,
    },
    {
        headerName: '채널명',
        field: 'chnlNm',
        flex: 1,
        cellStyle: { lineHeight: `${GRID_LINE_HEIGHT.C[1]}px` },
        tooltipField: 'chnlNm',
    },
    {
        headerName: '설명',
        field: 'chnlMemo',
        width: 300,
        tooltipField: 'chnlMemo',
        cellRenderer: 'longTextRenderer',
    },
];
