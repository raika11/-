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
        tooltipField: 'domainUrl',
    },
    {
        headerName: '도메인명',
        field: 'domainName',
        width: 94,
        flex: 1,
        tooltipField: 'domainName',
    },
    {
        headerName: '',
        field: 'delete',
        width: 33,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableDeleteButton {...row} onClick={data.onDelete} />;
        },
    },
];
