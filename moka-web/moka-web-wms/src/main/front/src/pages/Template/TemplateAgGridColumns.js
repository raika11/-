import React from 'react';
import DeleteButton from './components/TemplateDeleteButton';

export default [
    {
        headerName: 'ID',
        field: 'templateSeq',
        width: 50,
        // cellClass: 'ag-cell-center',
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '템플릿명',
        field: 'templateName',
        width: 158,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '위치그룹',
        field: 'tpZone',
        width: 65,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '사이즈',
        field: 'templateWidth',
        width: 53,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '',
        field: 'delete',
        width: 36,
        cellRendererFramework: (row) => <DeleteButton {...row} />,
    },
];
