import { GRID_LINE_HEIGHT } from '@/style_constants';

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.M}px`,
};

const cellClassRules = {
    'ag-center-cell': () => true,
};

export default [
    {
        headerName: 'No',
        field: 'pkgSeq',
        width: 45,
        cellClassRules,
    },
    {
        headerName: '카테고리',
        field: 'category',
        width: 80,
        tooltipField: 'categoryNames',
        cellClassRules,
    },
    {
        headerName: '유형',
        field: 'pkgDivName',
        width: 65,
        cellClassRules,
    },
    {
        headerName: '패키지명',
        field: 'pkgTitle',
        cellStyle,
        flex: 1,
        tooltipField: 'pkgTitle',
        cellRenderer: 'longTextRenderer',
    },
    {
        headerName: '담당 기자',
        field: 'reporter',
        width: 90,
        tooltipField: 'reporterNames',
        cellClassRules,
    },
    {
        headerName: '기사 수',
        field: 'artCnt',
        width: 60,
        cellClassRules,
    },
    {
        headerName: '생성일',
        sortable: true,
        field: 'regDt',
        width: 90,
        comparator: () => 0,
        cellClassRules,
    },
    {
        headerName: '최신기사\n업데이트',
        field: 'lastArticleUpdateDate',
        sortable: true,
        width: 90,
        comparator: () => 0,
        cellClassRules,
    },
    {
        headerName: '종료',
        field: 'endYn',
        width: 40,
        cellRenderer: 'usedYnRenderer',
        cellClassRules,
    },
    {
        headerName: '구독',
        field: 'scbYn',
        width: 40,
        cellRenderer: 'usedYnSecondRenderer',
        cellClassRules,
    },
    {
        headerName: '노출',
        field: 'expYn',
        width: 40,
        cellRenderer: 'usedYnThirdRenderer',
        cellClassRules,
    },
    {
        headerName: '바로가기',
        field: 'directLink',
        width: 70,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
            text: '보기',
            overlayText: '보기',
            clickFunctionName: 'onClickDirectLink',
        },
        cellClassRules,
        // cellRendererFramework: (row) => < {...row} />,
    },
];
