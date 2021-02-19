import React from 'react';
import { MokaTableDeleteButton } from '@components';

export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };
export const columnDefs = [
    {
        headerName: 'ID',
        field: 'domainId',
        width: 50,
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
        headerName: '사용',
        field: 'usedYn',
        width: 40,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '',
        field: 'delete',
        width: 28,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableDeleteButton {...row} onClick={data.onDelete} />;
        },
    },
];
