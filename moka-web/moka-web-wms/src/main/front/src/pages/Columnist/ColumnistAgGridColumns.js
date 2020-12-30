import React from 'react';
import { faCircle } from '@moka/fontawesome-pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default [
    {
        headerName: 'seqNo',
        field: 'seqNo',
        width: 1,
        hide: true,
    },
    {
        headerName: '기자번호',
        field: 'repSeq',
        width: 90,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '기자이름',
        field: 'columnistNm',
        width: 90,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        autoHeight: true,
        tooltipField: 'columnistNm',
    },
    {
        headerName: '이메일',
        field: 'email',
        width: 200,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        autoHeight: true,
        tooltipField: 'email',
    },
    {
        headerName: '상태정보',
        field: 'status',
        width: 80,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        cellRendererFramework: ({ value }) => {
            let clazz = value === 'Y' ? 'color-primary' : 'color-gray150';
            return <FontAwesomeIcon icon={faCircle} fixedWidth className={clazz} />;
        },
    },
    {
        headerName: '약력정보',
        field: 'profile',
        width: 200,
        flex: 1,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 90,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        tooltipField: 'regDt',
    },
];
