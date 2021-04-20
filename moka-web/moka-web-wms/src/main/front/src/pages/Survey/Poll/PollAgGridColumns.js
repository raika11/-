import React from 'react';
import { GRID_LINE_HEIGHT } from '@/style_constants';
import { messageBox } from '@utils/toastUtil';
import { MokaTableDeleteButton } from '@components';
import MultiRowColumnComponent from '@pages/Survey/Poll/components/MultiRowColumnComponent';

export const columnDefs = [
    {
        headerName: 'ID',
        field: 'id',
        width: 50,
    },
    {
        headerName: '그룹',
        field: 'group',
        width: 80,
    },
    {
        headerName: '투표 제목',
        field: 'title',
        wrapText: true,
        cellStyle: { lineHeight: `${GRID_LINE_HEIGHT.M}px` },
        flex: 1,
        cellRenderer: 'longTextRenderer',
        tooltipField: 'title',
    },
    {
        headerName: '상태',
        field: 'status',
        width: 70,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '시작일\n종료일',
        field: 'endDt',
        width: 110,
        cellStyle: { lineHeight: `${GRID_LINE_HEIGHT.M}px` },
        cellRendererFramework: (param) => {
            return <MultiRowColumnComponent values={[param.data.startDt, param.value]} />;
        },
    },
    {
        headerName: '보기',
        field: 'preview',
        width: 50,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
            iconButton: true,
            iconName: 'fal-file-search',
            overlayText: '미리보기',
            clickFunctionName: 'onPreview',
        },
    },
    /*{
        headerName: '등록자',
        field: 'regMember',
        cellStyle: { diplay: 'flex', alignItems: 'center' },
        children: [
            {
                headerName: '등록일시',
                field: 'regDt',
                width: 130,
                cellStyle: { lineHeight: '18px' },
                cellRendererFramework: (param) => {
                    const regMember = param.data.regMember;
                    let regMemberIdNm = '';
                    if (regMember instanceof Object) {
                        regMemberIdNm = `${regMember.memberId}(${regMember.memberNm})`;
                    }
                    return <MultiRowColumnComponent values={[regMemberIdNm, param.value]} />;
                },
            },
        ],
    },*/
    {
        headerName: '등록자\n등록일시',
        field: 'regDt',
        width: 110,
        cellStyle: { lineHeight: `${GRID_LINE_HEIGHT.M}px` },
        cellRendererFramework: (param) => {
            const regMember = param.data.regMember;
            let regMemberIdNm = '';
            if (regMember instanceof Object) {
                regMemberIdNm = regMember ? `${regMember.memberNm}(${regMember.memberId})` : '';
            }
            return <MultiRowColumnComponent values={[regMemberIdNm, param.value]} />;
        },
    },
    {
        headerName: '수정자\n수정일시',
        field: 'modDt',
        width: 110,
        cellStyle: { lineHeight: `${GRID_LINE_HEIGHT.M}px` },
        cellRendererFramework: (param) => {
            const modMember = param.data.modMember;

            let modMemberIdNm = '';
            if (modMember instanceof Object) {
                modMemberIdNm = `${modMember.memberNm}(${modMember.memberId})`;
            }

            return <MultiRowColumnComponent values={[modMemberIdNm, param.value]} />;
        },
    },
    /*{
        headerName: '수정자',
        field: 'modMember',
        width: 70,
        children: [
            {
                headerName: '수정일시',
                field: 'modDt',
                width: 130,
                cellStyle: { lineHeight: '18px' },
                cellRendererFramework: (param) => {
                    const modMember = param.data.modMember;

                    let modMemberIdNm = '';
                    if (modMember instanceof Object) {
                        modMemberIdNm = `${modMember.memberId}(${modMember.memberNm})`;
                    }

                    return <MultiRowColumnComponent values={[modMemberIdNm, param.value]} />;
                },
            },
        ],
    },*/
    {
        headerName: '',
        field: 'delete',
        width: 38,
        cellRendererFramework: (param) => {
            return (
                param.data.isDelete && (
                    <MokaTableDeleteButton
                        {...param}
                        onClick={() => {
                            messageBox.confirm(`<b>(${param.data.id})'${param.data.title}'</b>을(를)\n <em style="color:red">정말 삭제하시겠습니까?</em>`, () => {
                                param.data.onDelete(param.data.id);
                            });
                        }}
                    />
                )
            );
        },
    },
];
