import React from 'react';
import { MokaTableDeleteButton } from '@components';

export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };
export const columnDefs = [
    {
        headerName: 'ID',
        field: 'datasetSeq',
        cellStyle: { fontSize: '12px' },
        width: 50,
    },
    {
        headerName: '데이터셋명',
        field: 'datasetName',
        // cellClass: 'ag-cell-center',
        cellStyle: { fontSize: '12px' },
        width: 204,
        flex: 1,
    },
    {
        headerName: '',
        field: 'autoCreateYn',
        width: 50,
        cellStyle: { fontSize: '12px' },
        cellRendererFramework: (params) => {
            const { autoCreateYn } = params.data;
            let autoCreateText = '수동형';
            if (autoCreateYn === 'Y') {
                autoCreateText = '자동형';
            }
            return autoCreateText;
        },
    },
    {
        headerName: '',
        field: 'delete',
        width: 50,
        cellStyle: { fontSize: '12px' },
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableDeleteButton {...row} onClick={data.onDelete} />;
        },
    },
];
