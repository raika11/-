import { GRID_LINE_HEIGHT } from '@/style_constants';
import { EtcButtonRenderer } from './GridRenderer';

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.C[0]}px`,
};

export default [
    {
        headerName: 'ID',
        field: 'id',
        width: 80,
        tooltipField: 'id',
        cellStyle,
    },
    {
        headerName: '전송일시',
        field: 'sendDt',
        width: 90,
        cellStyle,
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
        cellStyle,
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
