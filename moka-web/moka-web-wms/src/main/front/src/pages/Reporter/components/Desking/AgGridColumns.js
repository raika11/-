import React from 'react';
import { GRID_LINE_HEIGHT } from '@/style_constants';
import none_img from '@assets/images/none_photo.png';
import ReporterPageButton from '../ReporterPageButton';

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.C[0]}px`,
};

export default [
    {
        headerName: '',
        rowDrag: true,
        width: 28,
        minWidth: 28,
        rowDragText: (params) => {
            return params.rowNode.data.repName;
        },
        cellClass: 'ag-content-center-cell',
    },
    {
        headerName: '번호',
        field: 'repSeq',
        width: 52,
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
        width: 40,
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
        width: 100,
        cellStyle,
    },
    {
        headerName: '아이디',
        field: 'joinsId',
        tooltipField: 'joinsId',
        width: 150,
        cellStyle,
    },
    {
        headerName: '이메일',
        field: 'repEmail1',
        tooltipField: 'repEmail1',
        width: 220,
        flex: 1,
        cellStyle,
    },
    {
        headerName: '노출여부',
        field: 'usedYn',
        width: 64,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '',
        field: 'reporterPage',
        width: 95,
        cellRendererFramework: (row) => <ReporterPageButton {...row} />,
    },
];
