import React from 'react';
import { Button } from 'react-bootstrap';

export const columnDefs = [
    {
        headerName: 'ID',
        field: 'id',
        width: 70,
        cellStyle: { fontSize: '12px', lineHeight: '65px' },
    },
    {
        headerName: '분류',
        field: 'section',
        width: 70,
        cellStyle: { fontSize: '12px', lineHeight: '65px' },
    },
    {
        headerName: '투표 제목',
        field: 'title',
        width: 70,
        flex: 1,
        cellStyle: { fontSize: '12px', lineHeight: '65px' },
    },
    {
        headerName: '상태',
        field: 'status',
        width: 70,
        cellStyle: { fontSize: '12px', lineHeight: '65px' },
    },
    {
        headerName: '시작일',
        field: 'startDt',
        width: 100,
        cellStyle: { fontSize: '12px', lineHeight: '65px' },
    },
    {
        headerName: '종료일',
        field: 'endDt',
        width: 100,
        cellStyle: { fontSize: '12px', lineHeight: '65px' },
    },
    {
        headerName: '미리보기',
        field: 'preview',
        width: 100,
        cellStyle: { fontSize: '12px', lineHeight: '60px' },
        cellRendererFramework: (param) => {
            return (
                <Button variant={param.value.variant} onClick={param.value.handleClick}>
                    {param.value.name}
                </Button>
            );
        },
    },
    {
        headerName: '입력날짜',
        field: 'regDt',
        width: 200,
        cellStyle: { fontSize: '12px' },
        children: [
            {
                headerName: '수정날짜',
                field: 'regDt',
                width: 130,
                cellStyle: { fontSize: '12px', lineHeight: '65px' },
            },
        ],
    },
    {
        headerName: '등록자',
        field: 'regDt',
        width: 70,
        cellStyle: { fontSize: '12px', lineHeight: '65px' },
        children: [
            {
                headerName: '수정자',
                field: 'updateDt',
                width: 130,
                cellStyle: { fontSize: '12px', lineHeight: '65px' },
            },
        ],
    },
    {
        headerName: '',
        field: 'delete',
        width: 70,
        cellStyle: { fontSize: '12px', lineHeight: '60px' },
        cellRendererFramework: (param) => {
            return (
                <Button variant={param.value.variant} onClick={param.value.handleClick}>
                    {param.value.name}
                </Button>
            );
        },
    },
];

export const rowData = [
    {
        id: '1939',
        section: '디지털썰전',
        title: '최근 남자 가수 그룹인 방탄소년단이 한국 가수 최초로 미국 빌보드 메인싱글 차트 1위라는 기록을 세웠다.',
        status: '진행',
        startDt: '2020-12-21',
        endDt: '2020-12-21',
        preview: {
            name: '미리보기',
            variant: 'outline-table-btn',
            handleClick: () => {
                console.log('미리보기');
            },
        },
        regDt: '2020-12-21 14:51:43',
        delete: {
            name: '삭제',
            variant: 'outline-table-btn',
            handleClick: () => {
                console.log('삭제');
            },
        },
    },
];
