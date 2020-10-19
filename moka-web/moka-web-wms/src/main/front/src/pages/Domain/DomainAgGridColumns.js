import React from 'react';
import ListDeleteButton from '@pages/AgGrid/ListDeleteButton';
import { faCircle } from '@moka/fontawesome-pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
        field: 'useYn',
        width: 40,
        cellStyle: { textAlign: 'center' },
        cellRendererFramework: (params) => {
            const useYn = params.data.useYn;
            let clazz = 'color-gray150';
            if (useYn === 'Y') {
                clazz = 'color-primary';
            }
            return <FontAwesomeIcon className="align-middle mr-2" icon={faCircle} fixedWidth className={clazz} />;
        },
        //preventRowClick: true,
    },
];
