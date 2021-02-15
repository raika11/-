import ReporterPageButton from './components/ReporterPageButton';

export const columnDefs = [
    {
        headerName: '번호',
        field: 'repSeq',
        tooltipField: 'repSeq',
        width: 55,
    },
    {
        headerName: '아이디',
        field: 'joinsId',
        tooltipField: 'joinsId',
        width: 100,
    },
    {
        headerName: '이름',
        field: 'repName',
        width: 80,
    },
    {
        headerName: '수정일시',
        field: 'modDt',
        width: 130,
    },
    {
        headerName: '이메일',
        field: 'repEmail1',
        tooltipField: 'repEmail1',
        width: 180,
        flex: 1,
    },
    {
        headerName: '노출여부',
        field: 'usedYn',
        cellRenderer: 'usedYnRenderer',
        width: 64,
    },
    {
        headerName: '',
        field: 'reporterPage',
        width: 95,
        cellRendererFramework: ReporterPageButton,
    },
];
