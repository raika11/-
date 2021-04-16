import { GRID_LINE_HEIGHT } from '@/style_constants';
import RelationPollAddBtn from '@pages/Survey/Poll/components/RelationPollAddBtn';

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.T}px`,
};

export const columnDefs = [
    {
        headerName: '',
        field: 'add',
        width: 60,
        cellRendererFramework: RelationPollAddBtn,
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
        field: 'category',
        tooltipField: 'categoryNames',
        cellStyle,
    },
    {
        headerName: '유형',
        width: 80,
        field: 'pkgDivName',
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
        field: 'reporter',
        width: 110,
        tooltipField: 'reporterNames',
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
        field: 'info',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: { text: '정보', clickFunctionName: 'onClick' },
    },
];
