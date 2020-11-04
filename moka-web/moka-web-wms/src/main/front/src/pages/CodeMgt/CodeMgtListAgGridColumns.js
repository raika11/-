import React from 'react';
import CodeMgtEditButton from './components/CodeMgtEditButton';

export const columnDefs = [
    {
        headerName: '기타코드',
        field: 'cdNm',
        width: 170,
        tooltipField: 'cdNm',
    },
    {
        headerName: '',
        field: 'edit',
        width: 40,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <CodeMgtEditButton {...row} onClick={data.edit} data={data} />;
        },
    },
];
