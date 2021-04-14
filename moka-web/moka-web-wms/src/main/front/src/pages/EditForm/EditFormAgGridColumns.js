import React from 'react';
import { MokaTableDeleteButton } from '@components';

export const columnDefs = [
    {
        headerName: 'ID',
        field: 'formSeq',
        width: 50,
    },
    {
        headerName: 'Form ID',
        field: 'formId',
        resizable: true,
        tooltipField: 'formId',
        width: 170,
    },
    {
        headerName: 'Form명',
        field: 'formName',
        tooltipField: 'formName',
        resizable: true,
        flex: 1,
    },
    {
        headerName: '',
        field: 'usedYn',
        width: 50,
        cellStyle: { textAlign: 'center' },
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableDeleteButton {...row} onClick={data.delete} />;
        },
        //preventRowClick: true,
    },
];
