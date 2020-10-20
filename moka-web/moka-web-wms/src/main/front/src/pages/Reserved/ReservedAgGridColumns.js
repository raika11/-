import React from 'react';
import { faCircle } from '@moka/fontawesome-pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const columnDefs = [
    {
        headerName: '예약어',
        field: 'domainId',
        width: 120,
    },
    {
        headerName: '값',
        field: 'domainName',
        width: 200,
    },
    {
        headerName: '',
        field: 'useYn',
        width: 50,
        cellStyle: { textAlign: 'center' },
        cellRendererFramework: (params) => {
            const useYn = params.data.useYn;
            let classColorName = 'color-gray150';
            if (useYn === 'Y') {
                classColorName = 'color-primary';
            }
            return <FontAwesomeIcon className="align-middle mr-2" icon={faCircle} fixedWidth className={classColorName} />;
        },
        //preventRowClick: true,
    },
];
