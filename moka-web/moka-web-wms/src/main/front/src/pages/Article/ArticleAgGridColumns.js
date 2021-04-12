import { GRID_LINE_HEIGHT } from '@/style_constants';
import ArticleActionBtn from './components/ArticleActionBtn';
import ArticleViewBtn from './components/ArticleViewBtn';
// import SourceRenderer from './components/SourceRenderer';
import TitleRenderer from './components/TitleRenderer';

const cellClassRules = {
    'ag-center-cell': () => true,
};

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.T[1]}`,
};

export default [
    {
        headerName: '',
        field: 'bulkflag',
        width: 22,
        maxWidth: 22,
        cellRenderer: 'usedYnRenderer',
        cellStyle: { ...cellStyle, paddingRight: 0 },
    },
    {
        headerName: '매체/분류',
        field: 'source',
        width: 123,
        cellRenderer: 'longTextRenderer',
        // cellRendererFramework: SourceRenderer,
    },
    {
        headerName: '보기',
        field: 'view',
        width: 110,
        cellClassRules,
        cellRendererFramework: ArticleViewBtn,
    },
    {
        headerName: '제목',
        field: 'artTitle',
        flex: 1,
        width: 100,
        tooltipField: 'artTitle',
        cellRendererFramework: TitleRenderer,
    },
    {
        headerName: '면/판',
        field: 'myunPan',
        width: 50,
        cellClassRules: {
            'ag-pre-cell': () => true,
        },
        cellStyle: {
            justifyContent: 'center',
        },
    },
    {
        headerName: '등록시간',
        field: 'regDt',
        width: 100,
        cellClassRules,
    },
    {
        headerName: '기능',
        field: 'register',
        width: 85,
        cellClassRules,
        cellRendererFramework: ArticleActionBtn,
    },
];
