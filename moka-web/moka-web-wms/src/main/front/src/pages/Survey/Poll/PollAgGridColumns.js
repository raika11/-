import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import MultiRowColumnComponent from '@pages/Survey/Poll/components/MultiRowColumnComponent';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { MokaIcon, MokaTableDeleteButton } from '@components';
import { messageBox } from '@utils/toastUtil';

export const columnDefs = [
    {
        headerName: 'ID',
        field: 'id',
        width: 50,
        cellStyle: { lineHeight: '65px' },
    },
    {
        headerName: '분류',
        field: 'category',
        width: 80,
        cellStyle: { lineHeight: '65px' },
    },
    {
        headerName: '투표 제목',
        field: 'title',
        flex: 1,
        cellStyle: { lineHeight: '65px' },
        cellClass: 'ag-grid-cell-left',
        tooltipField: 'title',
    },
    {
        headerName: '상태',
        field: 'status',
        width: 70,
        cellStyle: { lineHeight: '65px' },
    },
    {
        headerName: '시작일',
        field: 'startDt',
        width: 130,
        cellStyle: { lineHeight: '65px' },
        children: [
            {
                headerName: '종료일',
                field: 'modDt',
                width: 130,
                cellStyle: { lineHeight: '16px' },
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
        cellStyle: { lineHeight: '60px' },
        cellRendererFramework: (param) => {
            return (
                <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                    <OverlayTrigger overlay={<Tooltip id="tooltip-table-preview-button">미리보기</Tooltip>}>
                        <Button
                            variant="white"
                            className="border-0 p-0 bg-transparent shadow-none"
                            onClick={() => {
                                if (param.data.onPreview instanceof Function) {
                                    param.data.onPreview(param.data.id);
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
        headerName: '입력날짜',
        field: 'regDt',
        cellStyle: { fontSize: '12px' },
        children: [
            {
                headerName: '수정날짜',
                field: 'modDt',
                width: 130,
                cellStyle: { lineHeight: '16px' },
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
        children: [
            {
                headerName: '수정자',
                field: 'modMember',
                width: 100,
                cellStyle: { lineHeight: '16px' },
                cellRendererFramework: (param) => {
                    const regMember = param.data.regMember;
                    const modMember = param.data.modMember;

                    let regMemberIdNm = '';
                    if (regMember instanceof Object) {
                        regMemberIdNm = `${regMember.memberId}(${regMember.memberNm})`;
                    }

                    let modMemberIdNm = '';
                    if (modMember instanceof Object) {
                        modMemberIdNm = `${modMember.memberId}(${modMember.memberNm})`;
                    }

                    return <MultiRowColumnComponent values={[regMemberIdNm, modMemberIdNm]} />;
                },
            },
        ],
    },
    {
        headerName: '',
        field: 'delete',
        width: 50,
        cellStyle: { lineHeight: '60px' },
        cellRendererFramework: (param) => {
            return (
                param.data.isDelete && (
                    <MokaTableDeleteButton
                        onClick={() => {
                            messageBox.confirm(`<b>(${param.data.id})'${param.data.title}'</b>을(를)\n <em style="color:red">정말 삭제하시겠습니까?</em>`, () => {
                                //console.log(param);
                                param.data.onDelete(param.data.id);
                            });
                        }}
                    />
                )
            );
        },
    },
];
