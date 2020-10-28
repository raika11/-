import React from 'react';
import { faPencil } from '@moka/fontawesome-pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const columnDefs = [
    {
        headerName: '기타코드',
        field: 'grpCd',
        width: 160,
    },
    {
        headerName: '',
        field: 'edit',
        width: 50,
        cellStyle: { textAlign: 'center' },
        cellRendererFramework: (row) => <FontAwesomeIcon icon={faPencil} fixedWidth />,
    },
];
