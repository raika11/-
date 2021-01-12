import React from 'react';
import { ChannelMoveButtonRenderer } from './ModalGridRenderer';

export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };
export const columnDefs = [
    {
        headerName: 'ID',
        field: 'castSrl',
        width: 80,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        hide: true,
    },
    {
        headerName: '채널명',
        field: 'getCastName',
        width: 250,
        flex: 1,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'getCastName',
    },
    {
        headerName: '개설일',
        field: 'crtDt',
        width: 150,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'crtDt',
    },
    {
        headerName: '채널번호',
        field: 'channelNumber',
        width: 80,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'channelNumber',
    },
    {
        headerName: '총회차',
        field: 'trackCnt',
        width: 80,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'trackCnt',
    },
    {
        headerName: '분류',
        field: 'simpodCategory',
        width: 150,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'simpodCategory',
    },
    {
        headerName: '보기',
        field: 'shareUrl',
        width: 100,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        cellRendererFramework: (params) => <ChannelMoveButtonRenderer shareUrl={params.value} />,
    },
];
