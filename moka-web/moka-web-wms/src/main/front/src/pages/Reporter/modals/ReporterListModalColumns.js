import React from 'react';
import { GRID_LINE_HEIGHT } from '@/style_constants';
import none_img from '@assets/images/none_photo.png';
import ReporterPageButton from '../components/ReporterPageButton';

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.C[0]}px`,
};

export const repColumnDefs = (data) => {
    const { channelType } = data;
    return [
        {
            headerName: '',
            field: 'add',
            width: 60,
            cellRenderer: 'buttonRenderer',
        },
        {
            headerName: '번호',
            field: 'repSeq',
            width: 60,
            cellStyle,
        },
        {
            headerName: '타입코드',
            field: 'jplusRepDivNm',
            width: 70,
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
            width: 75,
            cellStyle,
        },
        {
            headerName: '아이디',
            field: 'joinsId',
            width: 120,
            tooltipField: 'joinsId',
            cellStyle,
        },
        {
            headerName: '이메일',
            field: 'repEmail1',
            flex: 1,
            tooltipField: 'repEmail1',
            cellStyle,
        },
        {
            headerName: '노출여부',
            field: 'usedYn',
            width: 64,
            cellRenderer: 'usedYnRenderer',
        },
        !channelType && {
            headerName: '',
            field: 'reporterPage',
            width: 95,
            cellRendererFramework: (row) => <ReporterPageButton {...row} />,
        },
        channelType && {
            headerName: '뉴스레터 여부',
            field: 'letterYn',
            width: 90,
            cellRenderer: 'usedYnSecondRenderer',
        },
    ].filter(Boolean);
};
