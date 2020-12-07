import React from 'react';
import { faCircle } from '@moka/fontawesome-pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default [
    {
        headerName: 'No',
        field: 'linkSeq',
        width: 60,
        minWidth: 60,
        cellStyle: { fontSize: '12px', lineHeight: '50px' },
    },
    {
        headerName: '대표 이미지',
        field: 'imgUrl',
        cellRenderer: 'imageRenderer',
        width: 50,
        minWidth: 50,
        flex: 1,
        cellStyle: { minHeight: '10px', paddingBottom: '1px' },
        autoHeight: false,
    },
    {
        headerName: '제목',
        field: 'linkTitle',
        tooltipField: 'linkTitle',
        width: 120,
        cellStyle: { fontSize: '12px', lineHeight: '50px' },
        flex: 1,
        autoHeight: false,
    },
    {
        headerName: 'URL',
        field: 'linkUrl',
        tooltipField: 'linkUrl',
        width: 150,
        cellStyle: { fontSize: '12px', lineHeight: '50px' },
        flex: 1,
        autoHeight: false,
    },
    {
        headerName: '설명',
        field: 'linkContent',
        tooltipField: 'linkContent',
        width: 200,
        cellStyle: { fontSize: '12px', lineHeight: '50px' },
        autoHeight: false,
    },
    {
        headerName: '등록자',
        field: 'regId',
        tooltipField: 'regId',
        width: 80,
        flex: 1,
        cellStyle: { fontSize: '12px', lineHeight: '50px' },
        autoHeight: false,
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 80,
        flex: 1,
        cellStyle: { fontSize: '12px', lineHeight: '50px' },
        autoHeight: false,
    },
    {
        headerName: '수정자',
        field: 'modId',
        tooltipField: 'modId',
        width: 80,
        flex: 1,
        cellStyle: { fontSize: '12px', lineHeight: '50px' },
        autoHeight: false,
    },
    {
        headerName: '수정일',
        field: 'modDt',
        width: 80,
        flex: 1,
        cellStyle: { fontSize: '12px', lineHeight: '50px' },
        autoHeight: false,
    },
    {
        headerName: '\t게재여부',
        field: 'usedYnText',
        flex: 1,
        width: 80,
        cellStyle: { fontSize: '12px', lineHeight: '50px', textAlign: 'center' },
        cellRendererFramework: ({ value }) => {
            let clazz = value === 'Y' ? 'color-primary' : 'color-gray150';
            return <FontAwesomeIcon icon={faCircle} fixedWidth className={clazz} />;
        },
    },
];
