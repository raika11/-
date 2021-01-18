import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import MultiRowColumnComponent from '@pages/Survey/Poll/components/MultiRowColumnComponent';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { MokaIcon, MokaTableDeleteButton } from '@components';

export const columnDefs = [
    {
        headerName: 'ID',
        field: 'id',
        width: 50,
        cellStyle: { fontSize: '12px', lineHeight: '65px' },
    },
    {
        headerName: '분류',
        field: 'category',
        width: 70,
        cellStyle: { fontSize: '12px', lineHeight: '65px' },
    },
    {
        headerName: '투표 제목',
        field: 'title',
        flex: 1,
        cellStyle: { fontSize: '12px', lineHeight: '65px' },
        cellClass: 'ag-grid-cell-left',
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
        width: 130,
        cellStyle: { fontSize: '12px', lineHeight: '65px' },
        children: [
            {
                headerName: '수정날짜',
                field: 'modDt',
                width: 130,
                cellStyle: { fontSize: '12px', lineHeight: '16px' },
                cellRendererFramework: (param) => {
                    return <MultiRowColumnComponent values={[param.data.startDt, param.value]} />;
                },
            },
        ],
    },
    {
        headerName: '보기',
        field: 'preview',
        width: 50,
        cellStyle: { fontSize: '12px', lineHeight: '60px' },
        cellRendererFramework: (param) => {
            return (
                <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                    <OverlayTrigger overlay={<Tooltip id="tooltip-table-preview-button">미리보기</Tooltip>}>
                        <Button variant="white" className="border-0 p-0 bg-transparent shadow-none" onClick={() => console.log('preview')}>
                            <MokaIcon iconName="fal-file-search" style={{ fontSize: '24px' }} />
                        </Button>
                    </OverlayTrigger>
                </div>
            );
        },
    },
    {
        headerName: '입력날짜',
        field: 'regDt',
        cellStyle: { fontSize: '12px' },
        children: [
            {
                headerName: '수정날짜',
                field: 'modDt',
                width: 130,
                cellStyle: { fontSize: '12px', lineHeight: '16px' },
                cellRendererFramework: (param) => {
                    return <MultiRowColumnComponent values={[param.data.regDt, param.value]} />;
                },
            },
        ],
    },
    {
        headerName: '등록자',
        field: 'regMember',
        width: 70,
        cellStyle: { fontSize: '12px' },
        children: [
            {
                headerName: '수정자',
                field: 'modeMember',
                width: 100,
                cellStyle: { fontSize: '12px', lineHeight: '16px' },
                cellRendererFramework: (param) => {
                    return <MultiRowColumnComponent values={[param.data.regMember, param.value]} />;
                },
            },
        ],
    },
    {
        headerName: '',
        field: 'delete',
        width: 50,
        cellStyle: { fontSize: '12px', lineHeight: '60px' },
        cellRendererFramework: (param) => {
            return <MokaTableDeleteButton />;
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
        delete: {
            name: '삭제',
            variant: 'outline-table-btn',
            handleClick: () => {
                console.log('삭제');
            },
        },
        regDt: '2020-12-21 14:51:43',
        updateDt: '2020-12-22 12:34:21',
        regId: 'thkim',
        regName: '김태형',
        modId: 'thkim2',
        modName: '김태형2',
    },
];

export const codes = {
    groups: [
        { key: '1', value: '관리자' },
        { key: '2', value: '자동차' },
        { key: '3', value: '중국연구소' },
        { key: '4', value: '디지털썰전' },
        { key: '5', value: '강남통신' },
        { key: '6', value: 'JES_골든' },
        { key: '7', value: '헬스케어' },
        { key: '8', value: '일간' },
        { key: '9', value: '포탈 life' },
        { key: '10', value: '마프' },
        { key: '11', value: '매거진' },
        { key: '12', value: 'Mr.밀리터리' },
        { key: '13', value: '헬스-정신건강' },
        { key: '14', value: '조인스2006' },
        { key: '15', value: '중앙일보' },
        { key: '16', value: '시민마이크' },
        { key: '17', value: '포털news' },
    ],
    status: [
        { key: 'D', value: '서비스 종료' },
        { key: 'S', value: '서비스 중' },
        { key: 'T', value: '일시중지' },
    ],
    servcode: [
        { key: '1', value: '정치' },
        { key: '2', value: '사회/경제' },
        { key: '3', value: '문화/방송연예' },
        { key: '4', value: '국제' },
        { key: '5', value: '스포츠' },
        { key: '6', value: '기타' },
        { key: '7', value: '자동차' },
        { key: '8', value: '건강' },
        { key: '9', value: '인물' },
        { key: '10', value: '중국연구소' },
        { key: '11', value: 'Life' },
    ],
    graphType: [
        { key: 'W', value: '일반형' },
        { key: 'V', value: '비교형' },
    ],
};
