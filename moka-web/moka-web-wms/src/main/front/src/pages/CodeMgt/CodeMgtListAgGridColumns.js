import React from 'react';
import CodeMgtEditButton from './components/CodeMgtEditButton';

export const columnDefs = [
    {
        headerName: '기타코드',
        field: 'cdNm',
        width: 160,
    },
    {
        headerName: '',
        field: 'edit',
        width: 50,
        cellStyle: { textAlign: 'center' },
        cellRendererFramework: (row) => {
            const { data } = row;
            return <CodeMgtEditButton {...row} onClick={data.edit} data={data} />;
        },
    },
];
