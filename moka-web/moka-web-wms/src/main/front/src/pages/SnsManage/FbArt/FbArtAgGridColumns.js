import { EtcButtonRenderer } from './GridRenderer';

export default [
    {
        headerName: 'ID',
        field: 'id',
        width: 80,
        tooltipField: 'id',
    },
    {
        headerName: '전송일시',
        field: 'sendDt',
        width: 90,
    },
    {
        headerName: '이미지',
        field: 'imgUrl',
        cellRenderer: 'imageRenderer',
        width: 60,
    },
    {
        headerName: 'SNS제목',
        field: 'title',
        flex: 1,
        tooltipField: 'title',
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 43,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '기타',
        field: 'id',
        width: 188,
        cellRendererFramework: EtcButtonRenderer,
    },
];
