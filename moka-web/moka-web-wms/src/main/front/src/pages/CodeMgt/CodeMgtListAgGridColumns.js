import React from 'react';
import CodeMgtEditButton from './components/CodeMgtEditButton';

export default [
    {
        headerName: '기타코드',
        field: 'cdNm',
        width: 168,
        flex: 1,
        tooltipField: 'cdNm',
    },
    {
        headerName: '',
        field: 'edit',
        width: 33,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <CodeMgtEditButton {...row} onClick={data.edit} data={data} />;
        },
    },
];
