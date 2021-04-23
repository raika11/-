import { GRID_LINE_HEIGHT } from '@/style_constants';

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.C[0]}px`,
};

export default [
    {
        rowDrag: true,
        width: 28,
        maxWidth: 28,
        rowDragText: (params) => {
            return params.rowNode.data.columnistNm;
        },
        cellClass: 'ag-content-center-cell',
    },
    {
        headerName: '기자번호',
        field: 'repSeqText',
        width: 65,
        cellStyle,
    },
    {
        headerName: '타입코드',
        field: 'jplusRepDivNm',
        width: 63,
        cellStyle,
    },
    {
        headerName: '사진',
        field: 'profilePhoto',
        width: 50,
        cellRenderer: 'imageRenderer',
        cellRendererParams: { roundedCircle: true, autoRatio: false },
        cellStyle: {
            paddingTop: '4px',
            paddingBottom: '4px',
        },
    },
    {
        headerName: '기자이름',
        field: 'columnistNm',
        width: 70,
        tooltipField: 'columnistNm',
        cellStyle,
    },
    {
        headerName: '이메일',
        field: 'email',
        width: 200,
        tooltipField: 'email',
        cellStyle,
    },
    {
        headerName: '약력정보',
        field: 'profile',
        width: 300,
        flex: 1,
        tooltipField: 'profile',
        cellStyle,
    },
    {
        headerName: '사용여부',
        field: 'status',
        width: 63,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 140,
        tooltipField: 'regDt',
    },
];
