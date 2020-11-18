import React from 'react';
import { MokaTableDeleteButton } from '@components';

export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };
export const columnDefs = [
    {
        headerName: 'ID',
        field: 'domainId',
        width: 80,
    },
    {
        headerName: 'URL',
        field: 'domainUrl',
        width: 200,
    },
    {
        headerName: '도메인명',
        field: 'domainName',
        width: 102,
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
