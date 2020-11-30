import React from 'react';
import { MokaInput } from '@components';

export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };
export const columnDefs = [
    {
        headerName: '선택',
        field: 'select',
        //cellStyle: { textAlign: 'center' },
        width: 65,
        cellRendererFramework: (params) => {
            const { seqNo } = params.data;
            return <MokaInput as="checkbox" value={seqNo}></MokaInput>;
        },
    },
    {
        headerName: '번호',
        field: 'seqNo',
        // cellClass: 'ag-cell-center',
        //cellStyle: { textAlign: 'center' },
        width: 75,
    },
    {
        headerName: '이름',
        field: 'memberNm',
        //cellStyle: { textAlign: 'center' },
        width: 95,
    },
    {
        headerName: '아이디',
        field: 'memberId',
        width: 60,
    },
    {
        headerName: '부서',
        field: 'dept',
        width: 135,
    },
    {
        headerName: '소속그룹',
        field: 'group',
        width: 135,
        cellRendererFramework: (params) => {
            //J중앙I일간E기타M매거진A관리자D청백R기사수신
            const { value: groups } = params;
            console.log(groups);
            let groupNm = '';
            if (groups) {
                const groupCodes = groups.split(',');
                for (const groupCode of groupCodes) {
                    if (groupNm !== '') {
                        groupNm += ',';
                    }
                    console.log(groupCode);
                    switch (groupCode) {
                        case 'J':
                            console.log('hhhh');
                            groupNm += '중앙일보';
                            break;
                        case 'I':
                            groupNm += '일간';
                            break;
                        case 'E':
                            groupNm += '기타';
                            break;
                        case 'M':
                            groupNm += '매거진';
                            break;
                        case 'A':
                            groupNm += '관리자';
                            break;
                        case 'D':
                            groupNm += '청백';
                            break;
                        case 'R':
                            groupNm += '기사수신';
                            break;
                        default:
                            break;
                    }
                }
            }

            return groupNm;
        },
    },
];
