import React from 'react';
import { MokaTableDeleteButton } from '@components';

export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };
export const columnDefs = [
    {
        headerName: 'ID',
        field: 'formSeq',
        width: 50,
    },
    {
        headerName: 'Form ID',
        field: 'formId',
        resizable: true,
        tooltipField: 'formId',
        width: 170,
    },
    {
        headerName: 'Form명',
        field: 'formName',
        tooltipField: 'formName',
        resizable: true,
        flex: 1,
    },
    {
        headerName: '',
        field: 'usedYn',
        width: 50,
        cellStyle: { textAlign: 'center' },
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableDeleteButton {...row} onClick={data.delete} />;
        },
        //preventRowClick: true,
    },
];
