import React from 'react';
import { faCircle } from '@moka/fontawesome-pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toastr } from 'react-redux-toastr';
import { MokaTableDeleteButton } from '@components';

export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };
export const columnDefs = [
    {
        headerName: 'ID',
        field: 'formSeq',
        width: 80,
    },
    {
        headerName: 'Form ID',
        field: 'formId',
        resizable: true,
        tooltipField: 'formId',
        width: 100,
    },
    {
        headerName: 'Form명',
        field: 'formName',
        tooltipField: 'formName',
        resizable: true,
        width: 100,
    },
    {
        headerName: 'URL',
        field: 'serviceUrl',
        tooltipField: 'serviceUrl',
        resizable: true,
        // cellClass: 'ag-cell-center',
        // cellStyle: { textAlign: 'center' },
        width: 200,
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
