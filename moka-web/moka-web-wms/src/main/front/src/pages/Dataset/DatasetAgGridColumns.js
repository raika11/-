import React from 'react';
import { faCircle } from '@moka/fontawesome-pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MokaTableDeleteButton } from '@components';

export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };
export const columnDefs = [
    {
        headerName: 'ID',
        field: 'datasetSeq',
        width: 80,
    },
    {
        headerName: '데이터셋명',
        field: 'datasetName',
        // cellClass: 'ag-cell-center',
        // cellStyle: { textAlign: 'center' },
        width: 150,
    },
    {
        headerName: '',
        field: 'autoCreateYn',
        width: 80,
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
        cellStyle: { textAlign: 'center' },
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableDeleteButton {...row} onClick={data.onDelete} />;
        },
    },
];
