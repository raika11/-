import React from 'react';
import TemplateLoadButton from '../components/TemplateLoadButton';

export default [
    {
        headerName: 'ID',
        field: 'seq',
        width: 70,
        tooltipField: 'seq',
        // cellClass: 'ag-cell-center',
        // cellStyle: { textAlign: 'center' },
    },
    {
        headerName: '작업일시',
        field: 'regDt',
        width: 155,
    },
    {
        headerName: '작업자',
        field: 'regId',
        width: 99,
        tooltipField: 'regId',
    },
    {
        headerName: '',
        field: 'load',
        width: 36,
        cellRendererFramework: (row) => <TemplateLoadButton {...row} />,
    },
];
