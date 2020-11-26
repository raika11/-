import React from 'react';
import { faCircle } from '@moka/fontawesome-pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default [
    {
        headerName: 'No',
        field: 'linkSeq',
        width: 1,
        cellStyle: { fontSize: '12px', lineHeight: '23px' },
    },
    {
        headerName: '이미지',
        field: 'imgUrl',
        cellRenderer: 'imageRenderer',
        width: 50,
        height: 60,
        cellStyle: { minHeight: '10px', paddingBottom: '1px' },
        autoHeight: false,
    },
    {
        headerName: '제목',
        field: 'linkTitle',
        tooltipField: 'linkTitle',
        width: 120,
        cellStyle: { fontSize: '12px', lineHeight: '23px' },
        wrapText: true,
        autoHeight: false,
    },
    {
        headerName: 'URL',
        field: 'linkUrl',
        tooltipField: 'linkUrl',
        width: 150,
        cellStyle: { fontSize: '12px', lineHeight: '23px' },
        wrapText: true,
        autoHeight: false,
    },
    {
        headerName: '설명',
        field: 'linkContent',
        tooltipField: 'linkContent',
        width: 200,
        cellStyle: { fontSize: '12px', lineHeight: '23px' },
        // wrapText: true,
        autoHeight: false,
    },
    {
        headerName: '등록자',
        field: 'regId',
        tooltipField: 'regId',
        width: 80,
        // flex: 1,
        cellStyle: { fontSize: '12px', lineHeight: '23px', whiteSpace: 'pre-line' },
        wrapText: true,
        autoHeight: false,
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 110,
        // flex: 1,
        cellStyle: { fontSize: '12px', lineHeight: '23px' },
        wrapText: true,
        autoHeight: false,
    },
    {
        headerName: '수정자',
        field: 'modId',
        tooltipField: 'modId',
        width: 80,
        // flex: 1,
        cellStyle: { fontSize: '12px', lineHeight: '23px', whiteSpace: 'pre-line' },
        wrapText: true,
        autoHeight: false,
    },
    {
        headerName: '수정일',
        field: 'modDt',
        width: 110,
        // flex: 1,
        cellStyle: { fontSize: '12px', lineHeight: '23px' },
        wrapText: true,
        autoHeight: false,
    },
    {
        headerName: '게재여부',
        field: 'usedYnText',
        flex: 1,
        width: 100,
        cellStyle: { fontSize: '12px', lineHeight: '23px', textAlign: 'center' },
        cellRendererFramework: (params) => {
            const usedYnText = params.data.usedYnText;
            let clazz = usedYnText === 'Y' ? 'color-negative' : '';
            return <FontAwesomeIcon icon={faCircle} fixedWidth className={clazz} />;
        },
    },
];
