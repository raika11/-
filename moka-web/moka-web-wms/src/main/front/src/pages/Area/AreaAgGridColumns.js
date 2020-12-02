import React from 'react';
import { MokaTableDeleteButton } from '@components';

const columnDefs = [
    {
        headerName: '',
        field: 'areaNm',
        width: 196,
        tooltipField: 'areaNm',
    },
    {
        headerName: '',
        field: 'delete',
        width: 36,
        cellStyle: { textAlign: 'center' },
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableDeleteButton {...row} onClick={data.onDelete} />;
        },
    },
];

export default columnDefs;
