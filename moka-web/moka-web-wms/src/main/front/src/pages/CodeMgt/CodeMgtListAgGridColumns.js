import React from 'react';
import CodeMgtEditButton from './components/CodeMgtEditButton';

export default [
    {
        headerName: '기타코드',
        field: 'cdNm',
        width: 176,
        flex: 1,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'cdNm',
    },
    {
        headerName: '',
        field: 'edit',
        width: 36,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <CodeMgtEditButton {...row} onClick={data.edit} data={data} />;
        },
    },
];
