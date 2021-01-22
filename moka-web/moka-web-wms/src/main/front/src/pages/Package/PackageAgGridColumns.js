import React from 'react';
import { MokaIcon } from '@/components';

export default [
    {
        headerName: 'No',
        field: 'seqNo',
        width: 45,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '카테고리',
        field: 'category',
        width: 70,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'category',
    },
    {
        headerName: '유형',
        field: 'type',
        width: 65,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '패키지명',
        field: 'title',
        wrapText: true,
        autoHeight: true,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        flex: 1,
    },
    {
        headerName: '담당 기자',
        field: 'reporter',
        wrapText: true,
        autoHeight: true,
        width: 80,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        // cellRendererFramework: (row) => < {...row} />,
        tooltipField: 'reporter',
    },
    {
        headerName: '기사 수',
        field: 'articleCount',
        width: 60,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '생성일',
        field: 'createDt',
        width: 70,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '최신 기사 업데이트',
        field: 'updateDt',
        width: 120,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '종료',
        field: 'endYn',
        width: 40,
        cellStyle: {},
        cellRendererFramework: (params) => {
            const { usedYn } = params.data;
            let color = usedYn === 'Y' ? 'color-primary' : 'color-gray150';
            return (
                <div className="h-100 d-flex align-items-center">
                    <MokaIcon iconName="fas-circle" fixedWidth className={color} />
                </div>
            );
        },
    },
    {
        headerName: '구독',
        field: 'subsYn',
        width: 40,
        cellStyle: {},
        cellRendererFramework: (params) => {
            const { usedYn } = params.data;
            let color = usedYn === 'Y' ? 'color-primary' : 'color-gray150';
            return (
                <div className="h-100 d-flex align-items-center">
                    <MokaIcon iconName="fas-circle" fixedWidth className={color} />
                </div>
            );
        },
    },
    {
        headerName: '노출',
        field: 'expoYn',
        width: 40,
        cellStyle: {},
        cellRendererFramework: (params) => {
            const { usedYn } = params.data;
            let color = usedYn === 'Y' ? 'color-primary' : 'color-gray150';
            return (
                <div className="h-100 d-flex align-items-center">
                    <MokaIcon iconName="fas-circle" fixedWidth className={color} />
                </div>
            );
        },
    },
    {
        headerName: '바로가기',
        field: 'shortcut',
        width: 70,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        // cellRendererFramework: (row) => < {...row} />,
    },
];

export const rowData = [
    {
        seqNo: '151',
        category: '국제',
        type: '이슈',
        title: '알고보면 쓸모있는 신기한 세계뉴스 - 알쓸신세',
        reporter: ['이경희, 김승현, 김원희'],
        articleCount: '110',
        createDt: '2021-01-01',
        updateDt: '2021-01-08',
        endYn: 'N',
        subsYn: 'Y',
        expoYn: 'Y',
        shortcut: '보기',
    },
    {
        seqNo: '150',
        category: '사회',
        type: '토픽',
        title: '봇물 터진 미투 선언',
        reporter: ['안승원'],
        articleCount: '12',
        createDt: '2021-01-01',
        updateDt: '2021-01-08',
        endYn: 'N',
        subsYn: 'N',
        expoYn: 'N',
        shortcut: '보기',
    },
    {
        seqNo: '149',
        category: '국제',
        type: '시리즈',
        title: '[오피니언] 김영희 칼럼',
        reporter: ['김영희'],
        articleCount: '7',
        createDt: '2021-01-01',
        updateDt: '2021-01-08',
        endYn: 'Y',
        subsYn: 'N',
        expoYn: 'Y',
        shortcut: '보기',
    },
    {
        seqNo: '148',
        category: ['경제', '사회'],
        type: '시리즈',
        title: '안창원의 부동산 노트',
        reporter: ['안창원'],
        articleCount: '68',
        createDt: '2021-01-01',
        updateDt: '2021-01-08',
        endYn: 'N',
        subsYn: 'Y',
        expoYn: 'Y',
        shortcut: '보기',
    },
];
