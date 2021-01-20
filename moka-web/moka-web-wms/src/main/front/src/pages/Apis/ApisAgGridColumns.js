import React from 'react';
import { MokaIcon } from '@/components';

export default [
    {
        headerName: 'API명',
        field: 'apiName',
        cellStyle: { fontSize: '12px' },
        width: 120,
        tooltipField: 'apiName',
    },
    {
        headerName: 'API경로',
        field: 'route',
        cellStyle: { fontSize: '12px' },
        width: 250,
        tooltipField: 'route',
    },
    {
        headerName: '설명',
        field: 'desc',
        cellStyle: { fontSize: '12px' },
        flex: 1,
        tooltipField: 'desc',
    },
    {
        headerName: '사용',
        field: 'usedYn',
        cellStyle: { fontSize: '12px', textAlign: 'center' },
        width: 40,
        cellRendererFramework: (params) => {
            const { usedYn } = params.data;
            let color = usedYn === 'Y' ? 'color-primary' : 'color-gray150';
            return <MokaIcon iconName="fas-circle" fixedWidth className={color} />;
        },
    },
    {
        headerName: '방식',
        field: 'method',
        cellStyle: { fontSize: '12px' },
        width: 50,
    },
];

export const rowData = [
    {
        seqNo: '1',
        apiName: '게시판 정보 API',
        route: 'api/board-info',
        desc: '게시판 목록 조회',
        usedYn: 'Y',
        method: 'GET',
    },
    {
        seqNo: '2',
        apiName: '게시판 등록 API',
        route: 'api/board-info',
        desc: '게시판 등록',
        usedYn: 'Y',
        method: 'POST',
    },
    {
        seqNo: '3',
        apiName: '게시판 삭제 API',
        route: 'api/board-info/{board_id}',
        desc: '게시판 삭제',
        usedYn: 'Y',
        method: 'DELETE',
    },
    {
        seqNo: '4',
        apiName: '게시판 수정 API',
        route: 'api/board-info/{board_id}',
        desc: '게시판 수정',
        usedYn: 'Y',
        method: 'PUT',
    },
    {
        seqNo: '5',
        apiName: '게시판 조회 API',
        route: 'api/board-info/{board_id}',
        desc: '게시판 조회',
        usedYn: 'Y',
        method: 'GET',
    },
    {
        seqNo: '6',
        apiName: '게시판 게시글 정보 API',
        route: 'api/board-info/{board_id}/has-members',
        desc: '게시판 내 게시글 존재 여부',
        usedYn: 'N',
        method: 'GET',
    },
];

export const params = [
    {
        name: '테스트 API',
        desc: '테스트 설명',
        paramYn: 'Y',
        dataType: 'string',
    },
    {
        name: '테스트 API',
        desc: '테스트 설명',
        paramYn: 'Y',
        dataType: 'string',
    },
    {
        name: '테스트 API',
        desc: '테스트 설명',
        paramYn: 'Y',
        dataType: 'string',
    },
    {
        name: '테스트 API',
        desc: '테스트 설명',
        paramYn: 'Y',
        dataType: 'string',
    },
    {
        name: '테스트 API',
        desc: '테스트 설명',
        paramYn: 'Y',
        dataType: 'string',
    },
    {
        name: '테스트 API',
        desc: '테스트 설명',
        paramYn: 'Y',
        dataType: 'string',
    },
    {
        name: '테스트 API',
        desc: '테스트 설명',
        paramYn: 'Y',
        dataType: 'string',
    },
    {
        name: '테스트 API',
        desc: '테스트 설명',
        paramYn: 'Y',
        dataType: 'string',
    },
    {
        name: '테스트 API',
        desc: '테스트 설명',
        paramYn: 'Y',
        dataType: 'string',
    },
    {
        name: '테스트 API',
        desc: '테스트 설명',
        paramYn: 'Y',
        dataType: 'string',
    },
    {
        name: '테스트 API',
        desc: '테스트 설명',
        paramYn: 'Y',
        dataType: 'string',
    },
    {
        name: '테스트 API',
        desc: '테스트 설명',
        paramYn: 'Y',
        dataType: 'string',
    },
    {
        name: '테스트 API',
        desc: '테스트 설명',
        paramYn: 'Y',
        dataType: 'string',
    },
    {
        name: '테스트 API',
        desc: '테스트 설명',
        paramYn: 'Y',
        dataType: 'string',
    },
    {
        name: '테스트 API',
        desc: '테스트 설명',
        paramYn: 'Y',
        dataType: 'string',
    },
    {
        name: '테스트 API',
        desc: '테스트 설명',
        paramYn: 'Y',
        dataType: 'string',
    },
    {
        name: '테스트 API',
        desc: '테스트 설명',
        paramYn: 'Y',
        dataType: 'string',
    },
    {
        name: '테스트 API',
        desc: '테스트 설명',
        paramYn: 'Y',
        dataType: 'string',
    },
    {
        name: '테스트 API',
        desc: '테스트 설명',
        paramYn: 'Y',
        dataType: 'string',
    },
    {
        name: '테스트 API',
        desc: '테스트 설명',
        paramYn: 'Y',
        dataType: 'string',
    },
];
