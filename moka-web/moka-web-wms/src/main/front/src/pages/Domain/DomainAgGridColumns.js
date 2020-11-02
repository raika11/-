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
        // cellClass: 'ag-cell-center',
        // cellStyle: { textAlign: 'center' },
        width: 200,
    },
    {
        headerName: '도메인명',
        field: 'domainName',
        width: 100,
    },
    {
        headerName: '',
        field: 'delete',
        width: 50,
        cellStyle: { textAlign: 'center' },
        cellRendererFramework: (row) => {
            /*const useYn = params.data.useYn;
            let clazz = 'color-gray150';
            if (useYn === 'Y') {
                clazz = 'color-primary';
            }
            return <FontAwesomeIcon icon={faCircle} fixedWidth className={clazz} />;*/
            const { data } = row;
            return <MokaTableDeleteButton {...row} onClick={data.delete} />;
        },
        //preventRowClick: true,
    },
];
