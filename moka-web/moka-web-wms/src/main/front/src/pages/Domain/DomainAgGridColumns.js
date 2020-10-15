import React from 'react';
import ListDeleteButton from '@pages/AgGrid/ListDeleteButton';

/**
 * <pre>
 *
 * 2020-10-14 thkim 최초생성
 * </pre>
 *
 * @since 2020-10-14 오후 2:37
 * @author thkim
 */
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
        // cellClass: 'ag-cell-center',
        // cellStyle: { textAlign: 'center' },
        width: 250,
    },
    {
        headerName: '도메인명',
        field: 'domainName',
        width: 80,
    },
    {
        headerName: '',
        field: 'append',
        width: 40,
        cellStyle: { textAlign: 'center' },
        cellRendererFramework: ListDeleteButton,
    },
];
