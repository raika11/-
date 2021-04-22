import { GRID_LINE_HEIGHT, GRID_ROW_HEIGHT } from '@/style_constants';
import PostSelectRenderer from './components/PostSelectRenderer';
import LoginNameRenderer from './components/LoginNameRenderer';

const cellClassRules = {
    'ag-center-cell': () => true,
};

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.M}px`,
    paddingTop: '6px',
    paddingBottom: '6px',
};

export default [
    {
        headerName: '번호',
        field: 'answSeq',
        width: 60,
        cellClassRules,
    },
    {
        headerName: '포스트',
        field: 'answMemo',
        cellClassRules,
        cellStyle: { ...cellStyle, minHeight: `${GRID_ROW_HEIGHT.T[1]}px` },
        wrapText: true,
        autoHeight: true,
        flex: 1,
    },
    {
        headerName: '작성자',
        field: 'loginName',
        width: 200,
        tooltipField: 'loginName',
        cellRendererFramework: LoginNameRenderer,
        cellClassRules,
        cellStyle,
    },
    {
        headerName: '공감수',
        field: 'goodCnt',
        width: 50,
        cellClassRules,
    },
    {
        headerName: '상태',
        field: 'answDiv',
        width: 95,
        cellRendererFramework: PostSelectRenderer,
        cellClassRules,
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 88,
        tooltipField: 'regDt',
        cellClass: 'ag-pre-cell',
        cellStyle,
    },
];
