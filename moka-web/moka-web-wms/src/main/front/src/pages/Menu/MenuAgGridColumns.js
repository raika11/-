import React from 'react';
import { faCircle } from '@moka/fontawesome-pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };

export const columnDefs = [
    {
        headerName: '번호',
        field: 'menuSeq',
        width: 50,
    },
    {
        headerName: '메뉴명',
        field: 'menuDisplayNm',
        width: 140,
        flex: true,
    },
    {
        headerName: '',
        field: 'usedYn',
        width: 50,
        cellStyle: { textAlign: 'center' },
        cellRendererFramework: (params) => {
            const usedYn = params.data.usedYn;
            let clazz = 'color-negative';
            if (usedYn === 'Y') {
                clazz = 'color-positive';
            }
            return <FontAwesomeIcon icon={faCircle} fixedWidth className={clazz} />;
        },
    },
];
