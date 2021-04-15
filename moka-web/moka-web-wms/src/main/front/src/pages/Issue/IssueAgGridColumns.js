import { GRID_LINE_HEIGHT } from '@/style_constants';

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.M}px`,
};

export default [
    {
        headerName: 'No',
        field: 'pkgSeq',
        width: 45,
    },
    {
        headerName: '카테고리',
        field: 'category',
        width: 80,
        tooltipField: 'categoryNames',
    },
    {
        headerName: '유형',
        field: 'pkgDivName',
        width: 65,
    },
    {
        headerName: '패키지명',
        field: 'pkgTitle',
        wrapText: true,
        autoHeight: true,
        cellStyle,
        flex: 1,
        tooltipField: 'pkgTitle',
    },
    {
        headerName: '담당 기자',
        field: 'reporter',
        wrapText: true,
        autoHeight: true,
        width: 90,
        tooltipField: 'reporterNames',
    },
    {
        headerName: '기사 수',
        field: 'artCnt',
        width: 60,
    },
    {
        headerName: '생성일',
        sortable: true,
        field: 'regDt',
        width: 90,
        comparator: () => 0,
    },
    {
        headerName: '최신기사\n업데이트',
        field: 'updDt',
        sortable: true,
        width: 90,
        comparator: () => 0,
    },
    {
        headerName: '종료',
        field: 'endYn',
        width: 40,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '구독',
        field: 'scbYn',
        width: 40,
        cellRenderer: 'usedYnSecondRenderer',
    },
    {
        headerName: '노출',
        field: 'expYn',
        width: 40,
        cellRenderer: 'usedYnThirdRenderer',
    },
    {
        headerName: '바로가기',
        field: 'shortcut',
        width: 70,
        // cellRendererFramework: (row) => < {...row} />,
    },
];
