import { EtcButtonRenderer } from './GridRenderer';

export default [
    {
        headerName: 'ID',
        field: 'id',
        width: 80,
        tooltipFied: 'id',
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '전송일시',
        field: 'sendDt',
        width: 90,
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '사진',
        field: 'imgUrl',
        cellRenderer: 'imageRenderer',
        cellStyle: { paddingTop: '1px', paddingBottom: '1px' },
        width: 90,
    },
    {
        headerName: 'SNS제목',
        field: 'title',
        wrapText: true,
        width: 250,
        flex: 1,
        tooltipField: 'title',
        cellStyle: {
            boxSizing: 'border-box',
            whiteSpace: 'normal',
            lineHeight: '20px',
            fontSize: '14px',
            display: '-webkit-box',
            paddingTop: '5px',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
        },
    },
    {
        headerName: '사용여부',
        field: 'usedYn',
        width: 64,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '기타',
        field: 'id',
        width: 188,
        cellRendererFramework: EtcButtonRenderer,
    },
];
