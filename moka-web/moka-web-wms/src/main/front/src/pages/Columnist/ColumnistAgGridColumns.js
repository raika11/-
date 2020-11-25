import React from 'react';
import { faCircle } from '@moka/fontawesome-pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default [
    {
        headerName: '기자번호',
        field: 'repSeq',
        width: 100,
        cellStyle: { fontSize: '12px', lineHeight: '23px' },
    },
    {
        headerName: '기자이름',
        field: 'columnistNm',
        width: 100,
        cellStyle: { fontSize: '12px', lineHeight: '23px' },
        wrapText: true,
        autoHeight: true,
        tooltipField: 'columnistNm',
    },
    {
        headerName: '이메일',
        field: 'email',
        width: 200,
        cellStyle: { fontSize: '12px', lineHeight: '23px' },
        wrapText: true,
        autoHeight: true,
        tooltipField: 'email',
    },
    {
        headerName: '상태정보',
        field: 'status',
        width: 80,
        cellStyle: { fontSize: '12px', lineHeight: '23px', textAlign: 'center' },
        wrapText: true,
        autoHeight: true,
        tooltipField: 'status',
        cellRendererFramework: (params) => {
            const status = params.data.status;
            let clazz = status === 'Y' ? 'color-negative' : '';
            return <FontAwesomeIcon icon={faCircle} fixedWidth className={clazz} />;
        },
    },
    {
        headerName: '약력정보',
        field: 'profile',
        width: 420,
        cellStyle: { fontSize: '12px', lineHeight: '23px' },
        wrapText: true,
        autoHeight: true,
        tooltipField: 'profile',
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 120,
        flex: 1,
        cellStyle: { fontSize: '12px', lineHeight: '23px' },
        wrapText: true,
        autoHeight: true,
        tooltipField: 'regDt',
    },
];
