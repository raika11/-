import { GRID_LINE_HEIGHT } from '@/style_constants';
import none_img from '@assets/images/none_photo.png';

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.C[0]}px`,
};

export default [
    {
        headerName: '기자번호',
        field: 'repSeqText',
        width: 65,
        cellStyle,
        cellClass: 'ag-prewrap-cell',
    },
    {
        headerName: '타입코드',
        field: 'jplusRepDivNm',
        width: 63,
        cellStyle,
        cellClass: 'ag-prewrap-cell',
    },
    {
        headerName: '사진',
        field: 'profilePhoto',
        width: 40,
        cellRenderer: 'imageRenderer',
        cellRendererParams: { roundedCircle: true, autoRatio: false, defaultImg: none_img },
        cellStyle: {
            paddingTop: '4px',
            paddingBottom: '4px',
        },
    },
    {
        headerName: '기자이름',
        field: 'columnistNm',
        width: 70,
        cellStyle,
    },
    {
        headerName: '이메일',
        field: 'email',
        width: 160,
        flex: 1,
        tooltipField: 'email',
        cellStyle,
    },
    {
        headerName: '약력정보',
        field: 'profile',
        tooltipField: 'profile',
        width: 160,
        flex: 1,
        cellStyle,
    },
    {
        headerName: '등록자',
        field: 'regMember',
        tooltipField: 'regMember',
        width: 130,
        cellStyle,
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 130,
        cellStyle,
    },
    {
        headerName: '사용',
        field: 'status',
        width: 40,
        cellRenderer: 'usedYnRenderer',
    },
];
