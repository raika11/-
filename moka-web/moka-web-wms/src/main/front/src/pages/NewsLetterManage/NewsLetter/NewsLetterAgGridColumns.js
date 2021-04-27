import React from 'react';
import { GRID_LINE_HEIGHT } from '@/style_constants';

const cellClassRules = {
    'ag-pre-cell': () => true,
};

export default [
    {
        headerName: 'NO',
        field: 'letterSeq',
        width: 30,
        cellClassRules,
    },
    {
        headerName: '방법',
        field: 'sendType',
        sortable: true,
        unSortIcon: true,
        sort: null,
        sortingOrder: ['asc', 'desc'],
        cellClassRules,
        width: 55,
    },
    {
        headerName: '유형',
        field: 'letterType',
        sortable: true,
        unSortIcon: true,
        sort: null,
        sortingOrder: ['asc', 'desc'],
        cellClassRules,
        width: 60,
    },
    {
        headerName: '분야',
        field: 'category',
        sortable: true,
        unSortIcon: true,
        sort: null,
        sortingOrder: ['asc', 'desc'],
        cellClassRules,
        width: 55,
    },
    {
        headerName: '뉴스레터 명',
        field: 'letterName',
        sortable: true,
        unSortIcon: true,
        sort: null,
        sortingOrder: ['asc', 'desc'],
        cellClassRules,
        flex: 1,
    },
    {
        headerName: '발송 시작일',
        field: 'sendStartDt',
        cellClassRules,
        width: 75,
    },
    {
        headerName: '최근 발송일',
        field: 'lastSendDt',
        cellClassRules,
        width: 75,
    },
    {
        headerName: '발송 주기',
        field: 'sendPriod',
        children: [
            { headerName: '일정/콘텐츠', field: 'sendInfo', width: 72, cellClassRules },
            { headerName: '시간', field: 'sendTime', width: 35, cellClassRules },
        ],
    },
    {
        headerName: '구독자 수',
        field: 'subscribeCount',
        cellClassRules,
        width: 60,
    },
    {
        headerName: '상태',
        field: 'status',
        sortable: true,
        unSortIcon: true,
        sort: null,
        sortingOrder: ['asc', 'desc'],
        cellClassRules,
        width: 60,
    },
    {
        headerName: '등록일',
        field: 'regDt',
        sortable: true,
        unSortIcon: true,
        sort: null,
        sortingOrder: ['asc', 'desc'],
        cellClassRules,
        width: 73,
    },
    {
        headerName: '등록자',
        field: 'regMember',
        cellStyle: { lineHeight: `${GRID_LINE_HEIGHT.M}px` },
        width: 50,
        cellRendererFramework: ({ data }) => {
            return (
                <div className="w-100 h-100 d-flex flex-column justify-content-center">
                    <p className="mb-0 text-truncate">{data.regMember.memberNm}</p>
                    <p className="mb-0 text-truncate">({data.regMember.memberId})</p>
                </div>
            );
        },
        tooltipField: 'regInfo',
    },
    {
        headerName: 'A/B TEST',
        field: 'abtestYn',
        width: 65,
        cellRenderer: 'usedYnRenderer',
    },
];
