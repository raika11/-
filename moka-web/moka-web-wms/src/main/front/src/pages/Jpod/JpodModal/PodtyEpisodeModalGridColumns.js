import React from 'react';
import { ChannelMoveButtonRenderer } from './ModalGridRenderer';

export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };
export const columnDefs = [
    {
        headerName: 'ID',
        field: 'episodeSrl',
        width: 80,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        hide: true,
    },
    {
        headerName: '에피소드명',
        field: 'title',
        width: 250,
        flex: 1,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'title',
    },
    {
        headerName: '개설일',
        field: 'crtDt',
        width: 100,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'crtDt',
    },
    {
        headerName: '채널번호',
        field: 'castSrl',
        width: 80,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'castSrl',
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
        field: 'author',
        width: 100,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'author',
    },
    {
        headerName: '보기',
        field: 'shareUrl',
        width: 100,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        cellRendererFramework: (params) => <ChannelMoveButtonRenderer shareUrl={params.value} />,
    },
];
