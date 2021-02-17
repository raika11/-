import React from 'react';
import { MokaTableDeleteButton } from '@components';

export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };
export const columnDefs = [
    {
        headerName: 'ID',
        field: 'datasetSeq',
        tooltipField: 'datasetSeq',
        width: 50,
    },
    {
        headerName: '데이터셋명',
        field: 'datasetName',
        tooltipField: 'datasetName',
        width: 190,
        flex: 1,
    },
    {
        headerName: '',
        field: 'autoCreateYn',
        width: 50,
        cellRendererFramework: (params) => {
            const { autoCreateYn } = params.data;
            let autoCreateText = '편집형';
            if (autoCreateYn === 'Y') {
                autoCreateText = '자동형';
            }
            return autoCreateText;
        },
    },
    {
        headerName: '',
        field: 'delete',
        width: 33,
        cellRendererFramework: (row) => {
            const { data } = row;
            if (data.autoCreateYn === 'Y') {
                return <MokaTableDeleteButton {...row} onClick={data.onDelete} />;
            } else {
                return null;
            }
        },
    },
];
