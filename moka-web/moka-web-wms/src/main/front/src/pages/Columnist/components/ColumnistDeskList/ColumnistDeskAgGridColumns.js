import React from 'react';
import { faCircle } from '@moka/fontawesome-pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default [
    {
        headerName: '',
        rowDrag: true,
        width: 24,
    },
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
        width: 63,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        cellRendererFramework: ({ value }) => {
            let clazz = value === 'Y' ? 'color-primary' : 'color-gray150';
            return (
                <div className="d-flex align-items-center h-100 justify-content-center">
                    <FontAwesomeIcon icon={faCircle} fixedWidth className={clazz} />
                </div>
            );
        },
    },
    {
        headerName: '약력정보',
        field: 'profile',
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
