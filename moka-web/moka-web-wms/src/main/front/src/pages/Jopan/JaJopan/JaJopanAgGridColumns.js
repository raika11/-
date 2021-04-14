import { GRID_LINE_HEIGHT } from '@/style_constants';

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.C[0]}px`,
};

export default [
    {
        headerName: '번호',
        field: 'seq',
        width: 40,
        cellStyle,
    },
    {
        headerName: '조판날짜',
        field: 'pressDate',
        width: 85,
        cellStyle,
    },
    {
        headerName: '호',
        field: 'id.ho',
        width: 50,
        tooltipField: 'ho',
        cellStyle,
    },
    {
        headerName: '섹션',
        field: 'sectionName',
        flex: 1,
        tooltipField: 'sectionName',
        cellStyle,
    },
    {
        headerName: '면',
        field: 'id.myun',
        width: 35,
        cellStyle,
    },
    {
        headerName: '판',
        field: 'id.pan',
        width: 35,
        cellStyle,
    },
    {
        headerName: '버전',
        field: 'id.revision',
        width: 40,
        cellStyle,
    },
    {
        headerName: '생성일',
        field: 'regDt',
        width: 135,
        cellStyle,
    },
    {
        headerName: '보기',
        field: 'show',
        width: 55,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: { text: '보기' },
    },
];
