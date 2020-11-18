import React from 'react';
import { faCircle } from '@moka/fontawesome-pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };

export const columnDefs = [
    {
        headerName: 'ID',
        field: 'memberId',
        tooltipField: 'memberId',
        width: 100,
    },
    {
        headerName: '이름',
        field: 'memberNm',
        width: 100,
    },
    {
        headerName: 'Email',
        field: 'email',
        tooltipField: 'email',
        width: 200,
    },
    {
        headerName: '휴대전화',
        field: 'mobilePhone',
        tooltipField: 'mobilePhone',
        width: 120,
    },
    {
        headerName: '소속(팀)',
        field: 'dept',
        tooltipField: 'dept',
        width: 140,
    },
    {
        headerName: '상태',
        field: 'status',
        width: 108,
    },
    {
        headerName: '비고',
        field: 'remark',
        tooltipField: 'remark',
        width: 200,
        flex: true,
    },
];

export const historyColumnDefs = [
    {
        headerName: 'NO',
        field: 'seqNo',
        width: 50,
        //        headerClass: 'text-center',
        //        cellStyle: { textAlign: 'center' },
    },
    {
        headerName: '아이피',
        field: 'ip',
        tooltipField: 'ip',
        width: 150,
    },
    {
        headerName: '성공여부',
        field: 'successYn',
        width: 70,
        cellStyle: { textAlign: 'center' },
        cellRendererFramework: (params) => {
            const successYn = params.data.successYn;
            let clazz = 'color-gray150';
            if (successYn === 'Y') {
                clazz = 'color-primary';
            }
            return <FontAwesomeIcon icon={faCircle} fixedWidth className={clazz} />;
        },
    },
    {
        headerName: '로그인일시',
        field: 'regDt',
        tooltipField: 'regDt',
        width: 200,
        flex: true,
    },
];
