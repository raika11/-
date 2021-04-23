import { GRID_LINE_HEIGHT } from '@/style_constants';
import none_img from '@assets/images/none_photo.png';
import ReporterPageButton from './components/ReporterPageButton';

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.C[0]}px`,
};

export const columnDefs = [
    {
        headerName: '번호',
        field: 'repSeq',
        tooltipField: 'repSeq',
        width: 55,
        cellStyle,
    },
    {
        headerName: '타입코드',
        field: 'jplusRepDivNm',
        width: 63,
        cellStyle,
    },
    {
        headerName: '사진',
        field: 'repImg',
        width: 50,
        cellRenderer: 'imageRenderer',
        cellRendererParams: { roundedCircle: true, autoRatio: false, defaultImg: none_img },
        cellStyle: {
            paddingTop: '4px',
            paddingBottom: '4px',
        },
    },
    {
        headerName: '이름',
        field: 'repName',
        width: 80,
        cellStyle,
    },
    {
        headerName: '아이디',
        field: 'joinsId',
        tooltipField: 'joinsId',
        width: 100,
        cellStyle,
    },
    {
        headerName: '이메일',
        field: 'repEmail1',
        tooltipField: 'repEmail1',
        width: 180,
        flex: 1,
        cellStyle,
    },
    {
        headerName: '수정일시',
        field: 'modDt',
        width: 130,
        cellStyle,
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
