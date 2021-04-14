import { DESK_HIST_PUBLISH } from '@/constants';

export default [
    {
        headerName: 'No',
        field: 'seq',
        width: 50,
        tooltipField: 'seq',
    },
    {
        headerName: '작업일시',
        field: 'regDt',
        width: 150,
        cellClassRules: {
            'text-positive': ({ data }) => data.approvalYn === 'N' && data.status === DESK_HIST_PUBLISH, // 예약 데이터
        },
    },
    {
        headerName: '작업자',
        field: 'regId',
        width: 90,
        flex: 1,
        tooltipField: 'regId',
    },
    {
        headerName: '불러오기',
        field: 'load',
        width: 65,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: { iconButton: true, iconName: 'fal-file-import', clickFunctionName: 'handleClickLoad' },
    },
];
