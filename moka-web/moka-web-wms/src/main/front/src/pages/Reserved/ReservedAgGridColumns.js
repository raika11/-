import React from 'react';
import { faCircle } from '@moka/fontawesome-pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const columnDefs = [
    {
        headerName: '예약어',
        field: 'reservedId',
        width: 120,
    },
    {
        headerName: '값',
        field: 'reservedValue',
        width: 200,
    },
    {
        headerName: '',
        field: 'usedYn',
        width: 50,
        cellStyle: { textAlign: 'center' },
        cellRendererFramework: (params) => {
            const usedYn = params.data.usedYn;
            let clazz = 'color-gray150';
            if (usedYn === 'Y') {
                clazz = 'color-primary';
            }
            return <FontAwesomeIcon className="align-middle mr-2" icon={faCircle} fixedWidth className={clazz} />;
        },
        //preventRowClick: true,
    },
];
