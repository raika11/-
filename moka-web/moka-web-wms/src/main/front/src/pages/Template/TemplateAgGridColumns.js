import React from 'react';
import DeleteButton from './components/TemplateDeleteButton';

export default [
    {
        headerName: 'ID',
        field: 'templateSeq',
        width: 50,
        // cellClass: 'ag-cell-center',
        // cellStyle: { textAlign: 'center' },
    },
    {
        headerName: '템플릿명',
        field: 'templateName',
        width: 158,
    },
    {
        headerName: '위치그룹',
        field: 'tpZone',
        width: 65,
    },
    {
        headerName: '사이즈',
        field: 'templateWidth',
        width: 53,
    },
    {
        headerName: '',
        field: 'delete',
        width: 36,
        cellRendererFramework: (row) => <DeleteButton {...row} />,
    },
];
