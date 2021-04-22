import { GRID_LINE_HEIGHT } from '@/style_constants';

const cellClassRules = {
    'ag-center-cell': () => true,
};

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.T[1]}`,
};

export default [
    {
        headerName: 'No',
        field: 'pkgSeq',
        width: 35,
    },
    {
        headerName: '구분',
        field: 'type',
        width: 80,
    },
    {
        headerName: '패키지 명',
        field: 'pkgName',
        flex: 1,
    },
    {
        headerName: '구독\n가능 여부',
        field: 'subscribeYn',
        width: 85,
    },
    {
        headerName: '등록일',
        field: 'regDt',
        sortable: true,
        unSortIcon: true,
        sort: null,
        sortingOrder: ['asc', 'desc'],
        width: 120,
    },
    {
        headerName: '종료일',
        field: 'offDt',
        sortable: true,
        unSortIcon: true,
        sort: null,
        sortingOrder: ['asc', 'desc'],
        width: 120,
    },
    {
        headerName: '등록자',
        field: 'regMember',
        width: 100,
    },
    {
        headerName: '구독\n설계 여부',
        field: 'regMember',
        width: 85,
    },
    {
        headerName: '뉴스레터\n설정 여부',
        field: 'regMember',
        width: 85,
    },
    {
        headerName: 'Push\n설정 여부',
        field: 'regMember',
        width: 85,
    },
];
