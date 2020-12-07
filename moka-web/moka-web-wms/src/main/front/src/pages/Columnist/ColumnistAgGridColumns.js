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
        cellStyle: { fontSize: '12px', lineHeight: '23px' },
    },
    {
        headerName: '기자이름',
        field: 'columnistNm',
        width: 90,
        cellStyle: { fontSize: '12px', lineHeight: '23px' },
        autoHeight: true,
        tooltipField: 'columnistNm',
    },
    {
        headerName: '이메일',
        field: 'email',
        width: 200,
        cellStyle: { fontSize: '12px', lineHeight: '23px' },
        autoHeight: true,
        tooltipField: 'email',
    },
    {
        headerName: '\t상태정보',
        field: 'status',
        width: 100,
        cellStyle: { fontSize: '12px', lineHeight: '23px', textAlign: 'center' },
        autoHeight: true,
        tooltipField: 'status',
        cellRendererFramework: ({ value }) => {
            let clazz = value === 'Y' ? 'color-primary' : 'color-gray150';

            return <FontAwesomeIcon icon={faCircle} fixedWidth className={clazz} />;
        },
    },
    {
        headerName: '약력정보',
        field: 'profile',
        width: 350,
        flex: 1,
        cellStyle: { fontSize: '12px', lineHeight: '23px' },
        autoHeight: true,
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 90,
        cellStyle: { fontSize: '12px', lineHeight: '23px' },
        autoHeight: true,
        tooltipField: 'regDt',
    },
];
