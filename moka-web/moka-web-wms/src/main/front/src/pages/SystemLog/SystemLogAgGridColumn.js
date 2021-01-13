import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@moka/fontawesome-pro-solid-svg-icons';
import React from 'react';

export const columnDefs = [
    {
        headerName: '',
        field: 'successYn',
        width: 50,
        cellStyle: { textAlign: 'center' },
        cellRendererFramework: (params) => {
            const usedYn = params.value;
            let clazz = 'color-negative';
            if (usedYn === 'Y') {
                clazz = 'color-positive';
            }
            return <FontAwesomeIcon icon={faCircle} fixedWidth className={clazz} />;
        },
    },
    {
        headerName: '로그ID',
        field: 'seqNo',
        width: 50,
    },
    {
        headerName: '메뉴명',
        field: 'menuName',
        flex: 1,
    },
    {
        headerName: '액션명',
        field: 'action',
        width: 80,
    },
    {
        headerName: '작업자ID',
        field: 'memId',
        width: 80,
    },
    {
        headerName: '작업자IP',
        field: 'regIp',
        width: 130,
    },
    {
        headerName: '작업일',
        field: 'regDt',
        width: 130,
    },
];
