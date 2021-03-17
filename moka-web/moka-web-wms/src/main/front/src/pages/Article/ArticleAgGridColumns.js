import ArticleActionBtn from './components/ArticleActionBtn';
import ArticleViewBtn from './components/ArticleViewBtn';
import SourceRenderer from './components/SourceRenderer';
import TitleRenderer from './components/TitleRenderer';

export default [
    {
        headerName: '        매체/분류',
        field: 'source',
        width: 150,
        wrapText: true,
        autoHeight: true,
        cellStyle: { lineHeight: '18px', display: 'flex', alignItems: 'center' },
        cellRendererFramework: SourceRenderer,
    },
    {
        headerName: '보기',
        field: 'view',
        width: 110,
        cellStyle: { display: 'flex', alignItems: 'center' },
        cellRendererFramework: ArticleViewBtn,
    },
    {
        headerName: '제목',
        field: 'artTitle',
        flex: 1,
        width: 100,
        tooltipField: 'artTitle',
        cellStyle: { lineHeight: '18px', display: 'flex', alignItems: 'center' },
        wrapText: true,
        autoHeight: true,
        cellRendererFramework: TitleRenderer,
    },
    {
        headerName: '면/판',
        field: 'myunPan',
        width: 50,
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'pre',
        },
    },
    {
        headerName: '등록시간',
        field: 'regDt',
        width: 100,
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
        },
    },
    {
        headerName: '기능',
        field: 'register',
        width: 85,
        cellStyle: { display: 'flex', alignItems: 'center' },
        cellRendererFramework: ArticleActionBtn,
    },
];
