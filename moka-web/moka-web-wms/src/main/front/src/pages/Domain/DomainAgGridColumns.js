import React from 'react';
import { MokaTableDeleteButton } from '@components';

const cellClassRules = { 'ft-12': () => true };
export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };
export const columnDefs = [
    {
        headerName: 'ID',
        field: 'domainId',
        width: 80,
        cellClassRules,
    },
    {
        headerName: 'URL',
        field: 'domainUrl',
        width: 200,
        cellClassRules,
    },
    {
        headerName: '도메인명',
        field: 'domainName',
        width: 94,
        flex: 1,
        cellClassRules,
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
