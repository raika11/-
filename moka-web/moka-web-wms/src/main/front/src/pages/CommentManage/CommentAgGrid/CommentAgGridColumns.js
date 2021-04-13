import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';
import { MokaIcon } from '@components';
import { GRID_LINE_HEIGHT } from '@/style_constants';

const cellClassRules = {
    'ag-center-cell': () => true,
};

export const columnDefs = [
    {
        colId: 'checkbox',
        width: 24,
        checkboxSelection: true,
        cellClassRules,
    },
    {
        headerName: '신고',
        field: 'declareCnt',
        width: 60,
        cellClassRules,
        tooltipField: 'declareCnt',
    },
    {
        headerName: '순번',
        field: 'cmtSeq',
        width: 80,
        cellClassRules,
        tooltipField: 'cmtSeq',
    },
    {
        headerName: '댓글내용',
        field: 'cont',
        wrapText: true,
        flex: 1,
        cellStyle: {
            display: '-webkit-box',
            overflow: 'hidden',
            '-webkit-line-clamp': '2',
            '-webkit-box-orient': 'vertical',
            lineHeight: `${GRID_LINE_HEIGHT.M}px`,
            cursor: 'pointer',
        },
        cellRendererFramework: (param) => {
            return (
                <span
                    onClick={() => {
                        if (param.data.onClickTitle instanceof Function) {
                            param.data.onClickTitle(param);
                        }
                    }}
                    className="d-flex flex-fill"
                >
                    {param.value}
                </span>
            );
        },
    },
    {
        headerName: '보기',
        field: 'preview',
        width: 50,
        cellClassRules,
        cellRendererFramework: (param) => {
            return (
                <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                    <OverlayTrigger overlay={<Tooltip id="tooltip-table-preview-button">미리보기</Tooltip>}>
                        <Button
                            variant="white"
                            className="border-0 p-0 bg-transparent shadow-none"
                            onClick={() => {
                                if (param.data.onPreview instanceof Function) {
                                    param.data.onPreview(param);
                                }
                            }}
                        >
                            <MokaIcon iconName="fal-file-search" style={{ fontSize: '18px' }} />
                        </Button>
                    </OverlayTrigger>
                </div>
            );
        },
    },
    {
        headerName: '등록자',
        field: 'regMember',
        cellClassRules,
        width: 150,
        tooltipField: 'regMember',
    },
    {
        headerName: '등록IP',
        field: 'memIp',
        cellClassRules,
        width: 130,
        // tooltipField: 'memIp',
    },
    {
        headerName: '계정',
        field: 'memSite',
        width: 80,
        cellClassRules,
    },
    {
        headerName: '등록일시',
        field: 'regDt',
        tooltipField: 'regDt',
        width: 120,
        cellRenderer: 'dateItemRenderer',
        cellStyle: { lineHeight: `${GRID_LINE_HEIGHT.M}px` },
    },
    {
        headerName: '상태',
        field: 'statusText',
        cellClassRules,
        width: 80,
        tooltipField: 'statusText',
    },
    {
        headerName: '매체',
        field: 'mediaText',
        width: 80,
        cellClassRules,
    },
    {
        headerName: '기능',
        field: 'action',
        width: 70,
        cellRenderer: 'deleteButtonRenderer',
        cellStyle: { overflow: 'visible' },
    },
];

export const BannedColumnDefs = {
    U: [
        // 차단 ID 관리 목록
        {
            headerName: '',
            colId: 'button',
            width: 80,
            field: 'bannedElement',
            cellClassRules,
            cellRenderer: 'banneButtonRenderer',
        },
        {
            headerName: '번호',
            field: 'seqNo',
            tooltipField: 'seqNo',
            width: 100,
        },
        {
            headerName: '아이디',
            field: 'tagValue',
            tooltipField: 'tagValue',
            width: 130,
        },
        {
            headerName: '계정',
            field: 'tagSource',
            tooltipField: 'tagSource',
            width: 80,
        },
        {
            headerName: '사유',
            field: 'cdNm',
            tooltipField: 'cdNm',
            width: 60,
        },
        {
            headerName: '내용',
            field: 'tagDesc',
            tooltipField: 'tagDesc',
            flex: 1,
        },
        {
            headerName: '등록자',
            field: 'regMemberInfo',
            tooltipField: 'regMemberInfo',
            width: 150,
        },
        {
            headerName: '등록일시',
            field: 'regDt',
            tooltipField: 'regDt',
            width: 160,
        },
        {
            headerName: '',
            colId: 'button',
            width: 80,
            field: 'historyInfo',
            cellRenderer: 'historyButtonRenderer',
        },
    ],
    I: [
        // 차단 IP 관리 목록
        {
            headerName: '',
            colId: 'button',
            width: 80,
            field: 'bannedElement',
            cellRenderer: 'banneButtonRenderer',
        },
        {
            headerName: '번호',
            field: 'seqNo',
            tooltipField: 'seqNo',
            width: 100,
        },
        {
            headerName: '등록IP',
            field: 'tagValue',
            tooltipField: 'tagValue',
            width: 150,
        },
        {
            headerName: '사유',
            field: 'cdNm',
            tooltipField: 'cdNm',
            width: 100,
        },
        {
            headerName: '내용',
            field: 'tagDesc',
            flex: 1,
        },
        {
            headerName: '등록자',
            field: 'regMemberInfo',
            tooltipField: 'regMemberInfo',
            width: 150,
        },
        {
            headerName: '등록일시',
            field: 'regDt',
            tooltipField: 'regDt',
            width: 160,
        },
        {
            headerName: '',
            colId: 'button',
            width: 80,
            field: 'historyInfo',
            cellRenderer: 'historyButtonRenderer',
        },
    ],
    W: [
        // 차단 금지어 목록
        {
            headerName: '',
            colId: 'button',
            width: 80,
            field: 'bannedElement',
            cellRenderer: 'banneButtonRenderer',
        },
        {
            headerName: '번호',
            field: 'seqNo',
            tooltipField: 'seqNo',
            width: 100,
        },
        {
            headerName: '금지어',
            field: 'tagValue',
            tooltipField: 'tagValue',
            width: 150,
        },
        {
            headerName: '사유',
            field: 'cdNm',
            tooltipField: 'cdNm',
            width: 100,
        },
        {
            headerName: '내용',
            field: 'tagDesc',
            tooltipField: 'tagDesc',
            flex: 1,
        },
        {
            headerName: '등록자',
            field: 'regMemberInfo',
            tooltipField: 'regMemberInfo',
            width: 150,
        },
        {
            headerName: '등록일시',
            field: 'regDt',
            tooltipField: 'regDt',
            width: 160,
        },
    ],
};
