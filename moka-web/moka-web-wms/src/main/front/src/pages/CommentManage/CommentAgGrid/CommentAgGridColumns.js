import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Button } from 'react-bootstrap';
import { MokaIcon } from '@components';
import React from 'react';

export const columnDefs = [
    {
        colId: 'checkbox',
        width: 24,
        checkboxSelection: true,
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '신고',
        field: 'declareCnt',
        tooltipField: 'declareCnt',
        width: 60,
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '순번',
        field: 'cmtSeq',
        tooltipField: 'cmtSeq',
        width: 80,
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '댓글내용',
        field: 'cont',
        //tooltipField: 'cont',
        flex: 1,
        //autoHeight: true,
        //resizable: true,
        // suppressDoubleClickExpand: true,
        cellStyle: {
            boxSizing: 'border-box',
            whiteSpace: 'normal',
            lineHeight: '22px',
            display: '-webkit-box',
            '-webkit-line-clamp': '2',
            '-webkit-box-orient': 'vertical',
            paddingTop: '13px',
            paddingBottom: '13px',
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
        cellStyle: { diplay: 'flex', alignItems: 'center' },
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
        tooltipField: 'regMember',
        width: 150,
        //cellRenderer: 'userInfoRenderer',
        cellStyle: { display: 'flex', alignItems: 'center', lineHeight: '25px' },
    },
    {
        headerName: '등록IP',
        field: 'memIp',
        tooltipField: 'memIp',
        width: 130,
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '계정',
        field: 'memSite',
        tooltipField: 'memSite',
        width: 80,
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '등록일시',
        field: 'regDt',
        tooltipField: 'regDt',
        width: 120,
        cellRenderer: 'dateItemRenderer',
        cellStyle: { display: 'flex', alignItems: 'center', lineHeight: '25px' },
    },
    {
        headerName: '상태',
        field: 'statusText',
        tooltipField: 'statusText',
        width: 80,
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '매체',
        field: 'mediaText',
        tooltipField: 'mediaText',
        width: 80,
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '기능',
        field: 'action',
        width: 70,
        // suppressDoubleClickExpand: true,
        cellRenderer: 'deleteButtonRenderer',
        cellStyle: { display: 'flex', alignItems: 'center', overflow: 'visible' },
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
            cellRenderer: 'banneButtonRenderer',
            cellStyle: { display: 'flex', alignItems: 'center' },
        },
        {
            headerName: '번호',
            field: 'seqNo',
            tooltipField: 'seqNo',
            width: 100,
            cellStyle: { display: 'flex', alignItems: 'center' },
        },
        {
            headerName: '아이디',
            field: 'tagValue',
            tooltipField: 'tagValue',
            width: 130,
            cellStyle: { display: 'flex', alignItems: 'center' },
        },
        {
            headerName: '계정',
            field: 'tagSource',
            tooltipField: 'tagSource',
            // cellRenderer: 'memSiteRenderer',
            width: 80,
            cellStyle: { display: 'flex', alignItems: 'center' },
        },
        {
            headerName: '사유',
            field: 'cdNm',
            tooltipField: 'cdNm',
            width: 60,
            cellStyle: { display: 'flex', alignItems: 'center' },
        },
        {
            headerName: '내용',
            field: 'tagDesc',
            tooltipField: 'tagDesc',
            flex: 1,
            cellStyle: { display: 'flex', alignItems: 'center', height: '50px' },
        },
        {
            headerName: '등록자',
            field: 'regMemberInfo',
            tooltipField: 'regMemberInfo',
            width: 150,
            cellStyle: { display: 'flex', alignItems: 'center' },
        },
        {
            headerName: '등록일시',
            field: 'regDt',
            tooltipField: 'regDt',
            width: 160,
            cellStyle: { display: 'flex', alignItems: 'center' },
        },
        {
            headerName: '',
            colId: 'button',
            width: 80,
            field: 'historyInfo',
            cellRenderer: 'historyButtonRenderer',
            cellStyle: { display: 'flex', alignItems: 'center' },
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
            cellStyle: { display: 'flex', alignItems: 'center' },
        },
        {
            headerName: '번호',
            field: 'seqNo',
            tooltipField: 'seqNo',
            width: 100,
            cellStyle: { display: 'flex', alignItems: 'center' },
        },
        {
            headerName: '등록IP',
            field: 'tagValue',
            tooltipField: 'tagValue',
            width: 150,
            cellStyle: { display: 'flex', alignItems: 'center' },
        },
        {
            headerName: '사유',
            field: 'cdNm',
            tooltipField: 'cdNm',
            width: 100,
            // flex: 1,
            cellStyle: { display: 'flex', alignItems: 'center' },
        },
        {
            headerName: '내용',
            field: 'tagDesc',
            flex: 1,
            cellStyle: { display: 'flex', alignItems: 'center', height: '50px' },
        },
        {
            headerName: '등록자',
            field: 'regMemberInfo',
            tooltipField: 'regMemberInfo',
            width: 150,
            cellStyle: { display: 'flex', alignItems: 'center' },
        },
        {
            headerName: '등록일시',
            field: 'regDt',
            tooltipField: 'regDt',
            width: 160,
            cellStyle: { display: 'flex', alignItems: 'center' },
        },
        {
            headerName: '',
            colId: 'button',
            width: 80,
            field: 'historyInfo',
            cellRenderer: 'historyButtonRenderer',
            cellStyle: { display: 'flex', alignItems: 'center' },
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
            cellStyle: { display: 'flex', alignItems: 'center' },
        },
        {
            headerName: '번호',
            field: 'seqNo',
            tooltipField: 'seqNo',
            width: 100,
            cellStyle: { display: 'flex', alignItems: 'center' },
        },
        {
            headerName: '금지어',
            field: 'tagValue',
            tooltipField: 'tagValue',
            width: 150,
            cellStyle: { display: 'flex', alignItems: 'center' },
        },
        {
            headerName: '사유',
            field: 'cdNm',
            tooltipField: 'cdNm',
            width: 100,
            // flex: 1,
            cellStyle: { display: 'flex', alignItems: 'center' },
        },
        {
            headerName: '내용',
            field: 'tagDesc',
            tooltipField: 'tagDesc',
            flex: 1,
            cellStyle: { display: 'flex', alignItems: 'center', height: '50px' },
        },
        {
            headerName: '등록자',
            field: 'regMemberInfo',
            tooltipField: 'regMemberInfo',
            width: 150,
            cellStyle: { display: 'flex', alignItems: 'center' },
        },
        {
            headerName: '등록일시',
            field: 'regDt',
            tooltipField: 'regDt',
            width: 160,
            cellStyle: { display: 'flex', alignItems: 'center' },
        },
    ],
};
