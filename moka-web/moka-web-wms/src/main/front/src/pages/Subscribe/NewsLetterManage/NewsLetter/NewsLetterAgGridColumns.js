import { GRID_LINE_HEIGHT } from '@/style_constants';

export default [
    {
        headerName: 'NO',
        field: 'no',
        width: 40,
    },
    {
        headerName: '방법',
        field: 'title',
        width: 45,
    },
    {
        headerName: '유형',
        field: 'test1',
        width: 60,
    },
    {
        headerName: '뉴스레터 명',
        field: 'newsLetter',
        flex: 1,
    },
    {
        headerName: '서비스 시작일',
        field: 'startDt',
        width: 150,
    },
    {
        headerName: '최근 발송일',
        field: 'brodcast',
        width: 150,
    },
    {
        headerName: '발송 주기',
        field: 'test4',
        width: 180,
    },
    {
        headerName: '구독자 수',
        field: 'subscriber',
        width: 70,
        wrapText: true,
        cellClassRules: {
            'ag-pre-cell': () => true,
        },
        cellStyle: { lineHeight: `${GRID_LINE_HEIGHT.M}px` },
    },
    {
        headerName: '상태',
        field: 'state',
        width: 45,
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 150,
    },
    {
        headerName: '등록자',
        field: 'regId',
        width: 70,
    },
    {
        headerName: 'A/B TEST',
        field: 'ab',
        width: 70,
    },
];
