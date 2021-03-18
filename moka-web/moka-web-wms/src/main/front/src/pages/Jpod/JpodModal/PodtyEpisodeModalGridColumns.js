import React from 'react';
import { ChannelMoveButtonRenderer } from './ModalGridRenderer';

export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };
export const columnDefs = [
    {
        headerName: '에피소드명',
        field: 'title',
        width: 200,
        cellStyle: { display: 'flex', alignItems: 'center', lineHeight: '21px' },
        tooltipField: 'title',
        wrapText: true,
    },
    {
        headerName: '게시일',
        field: 'crtDt',
        width: 90,
        cellStyle: { display: 'flex', alignItems: 'center', lineHeight: '21px' },
        tooltipField: 'crtDt',
    },
    {
        headerName: '제작자',
        field: 'author',
        width: 80,
        cellStyle: { display: 'flex', alignItems: 'center' },
        tooltipField: 'author',
    },
    {
        headerName: '소개',
        field: 'summary',
        flex: 1,
        cellStyle: { display: 'flex', alignItems: 'center', lineHeight: 'initial', paddingTop: '5px', paddingBottom: '5px' },
        tooltipField: 'summary',
        wrapText: true,
        autoHeight: true,
    },
    {
        headerName: '보기',
        field: 'shareUrl',
        width: 60,
        cellStyle: { display: 'flex', alignItems: 'center' },
        cellRendererFramework: (params) => <ChannelMoveButtonRenderer shareUrl={params.value} />,
    },
];
