import React from 'react';
import { MokaIcon } from '@/components';

export default [
    {
        headerName: '매체코드',
        field: 'sourceCode',
        cellStyle: { fontSize: '12px' },
        width: 65,
    },
    {
        headerName: '매체명',
        field: 'sourceName',
        cellStyle: { fontSize: '12px' },
        width: 90,
        tooltipField: 'sourceName',
    },
    {
        headerName: 'XML경로',
        field: 'cpXmlPath',
        cellStyle: { fontSize: '12px' },
        width: 125,
        flex: 1,
        tooltipField: 'cpXmlPath',
    },
    {
        headerName: '편집여부',
        field: 'artEditYn',
        cellStyle: { fontSize: '12px', textAlign: 'center' },
        width: 65,
        cellRendererFramework: (params) => {
            const { artEditYn } = params.data;
            let color = artEditYn === 'Y' ? 'color-primary' : 'color-gray150';
            return <MokaIcon iconName="fas-circle" fixedWidth className={color} />;
        },
    },
    {
        headerName: 'XML포맷 출처',
        field: 'joinsXmlFormat',
        cellStyle: { fontSize: '12px' },
        width: 93,
        cellRendererFramework: (params) => {
            const { joinsXmlFormat } = params.data;
            let joinsXmlText = 'CP업체';
            if (joinsXmlFormat === 'Y') {
                joinsXmlText = '조인스';
            }
            return joinsXmlText;
        },
    },
    {
        headerName: '이미지',
        field: 'receiveImgYn',
        cellStyle: { fontSize: '12px' },
        width: 50,
        cellRendererFramework: (params) => {
            const { receiveImgYn } = params.data;
            let receiveImgText = '업체';
            if (receiveImgYn === 'Y') {
                receiveImgText = '로컬';
            }
            return receiveImgText;
        },
    },
    {
        headerName: 'CP수신여부',
        field: 'rcvUsedYn',
        cellStyle: { fontSize: '12px', textAlign: 'center' },
        width: 80,
        cellRendererFramework: (params) => {
            const { rcvUsedYn } = params.data;
            let color = rcvUsedYn === 'Y' ? 'color-primary' : 'color-gray150';
            return <MokaIcon iconName="fas-circle" fixedWidth className={color} />;
        },
    },
    {
        headerName: '벌크여부',
        field: 'bulkFlag',
        cellStyle: { fontSize: '12px', textAlign: 'center' },
        width: 65,
        cellRendererFramework: (params) => {
            const { bulkFlag } = params.data;
            let color = bulkFlag === 'Y' ? 'color-primary' : 'color-gray150';
            return <MokaIcon iconName="fas-circle" fixedWidth className={color} />;
        },
    },
    {
        headerName: '등록일시',
        field: 'regDt',
        cellStyle: { fontSize: '12px' },
        width: 130,
    },
];
