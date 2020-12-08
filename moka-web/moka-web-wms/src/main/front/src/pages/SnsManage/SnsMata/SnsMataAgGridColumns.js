import React from 'react';
import { ListTitleRenderer, ImageRenderer, ButtonStatusRenderer, SendStatusRenderer } from './GridRenderer';
import { faCircle } from '@moka/fontawesome-pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const tempColumnDefs = [
    {
        headerName: 'ID',
        field: 'totalId',
        width: 50,
        cellStyle: { fontSize: '12px', lineHeight: '23px', paddingTop: '22px' },
    },
    // {
    //     headerName: '\t출처',
    //     field: 'source',
    //     wrapText: true,
    //     width: 130,
    //     cellStyle: { fontSize: '12px', lineHeight: '23px', paddingTop: '22px', paddingLeft: '8px' },
    // },
    {
        headerName: '\t출고일',
        field: 'pressDate',
        width: 100,
        cellStyle: { fontSize: '12px', lineHeight: '23px', paddingTop: '22px', paddingLeft: '12px' },
    },
    {
        headerName: '\t이미지',
        field: 'listRepImg',
        cellRendererFramework: (params) => <ImageRenderer src={`http://pds.joins.com/${params.data.artThumb}`} />,
        width: 80,
        cellStyle: { fontSize: '12px', lineHeight: '23px', paddingTop: '8px' },
    },
    {
        headerName: '기사제목',
        field: 'listTitle',
        width: 380,
        flex: true,
        //cellRendererFramework: (params) => <ListTitleRenderer title={params.data.artTitle} summary={params.data.artSummary} />,
        cellStyle: { fontSize: '12px', lineHeight: '40px' },
        children: [
            {
                headerName: 'SNS제목',
                field: 'listTitle',
                width: 380,
                flex: true,
                cellRendererFramework: (params) => <ListTitleRenderer title={params.data.artTitle} summary={params.data.artSummary} />,
                cellStyle: { fontSize: '12px', lineHeight: '40px' },
            },
        ],
    },
    {
        headerName: '\t전송상태',
        field: 'sendStatus',
        width: 120,
        wrapText: true,
        cellRendererFramework: (params) => <SendStatusRenderer sendFlag={params.data.serviceFlag} facebook={params.data.sendFb} twitter={params.data.sendTw} />,
        cellStyle: { fontSize: '12px', lineHeight: '23px' },
    },

    {
        headerName: '상태',
        field: 'insStatus',
        width: 50,
        wrapText: true,
        cellRendererFramework: ({ value }) => {
            let clazz = value === 'Y' ? 'color-primary' : 'color-gray150';
            return <FontAwesomeIcon icon={faCircle} fixedWidth className={clazz} />;
        },
        cellStyle: { fontSize: '12px', lineHeight: '23px', paddingTop: '22px', paddingLeft: '12px' },
    },
    {
        headerName: '\t전송일',
        field: 'senddate',
        width: 130,
        wrapText: true,
        cellStyle: { fontSize: '12px', lineHeight: '23px', paddingTop: '22px', paddingLeft: '12px' },
    },
    {
        headerName: '  전송',
        field: 'insStatus',
        width: 80,
        wrapText: true,
        cellRendererFramework: (params) => <ButtonStatusRenderer {...params} />,
        cellStyle: { fontSize: '12px', lineHeight: '23px' },
    },
];
