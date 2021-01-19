import React from 'react';
import { ListTitleRenderer, ButtonStatusRenderer, SendStatusRenderer } from './component';

export const columnDefs = [
    {
        headerName: 'ID',
        field: 'id',
        width: 70,
        cellStyle: { fontSize: '12px', lineHeight: '23px' },
        headerClass: 'ag-grid-sns-meta-header',
    },
    {
        headerName: '출고일',
        headerClass: 'ag-grid-sns-meta-header',
        field: 'forwardDate',
        width: 90,
        cellStyle: { fontSize: '12px', lineHeight: '23px' },
    },
    {
        headerName: '이미지',
        field: 'thumbnail',
        headerClass: 'ag-grid-sns-meta-header',
        cellRenderer: 'imageRenderer',
        width: 80,
    },
    {
        headerName: '기사제목',
        headerClass: 'ag-grid-sns-meta-header',
        width: 120,
        children: [
            {
                headerName: 'SNS제목',
                field: 'listTitle',
                flex: 1,
                headerClass: 'ag-grid-sns-meta-header',
                cellRendererFramework: (params) => {
                    console.log(params);
                    return <ListTitleRenderer title={params.data.title} summary={params.data.summary} />;
                },
            },
        ],
    },
    {
        headerName: '전송상태',
        field: 'sendType',
        width: 100,
        cellRendererFramework: (params) => (
            <SendStatusRenderer sendFlag={params.data.sendStatus.button} facebook={params.data.sendStatus.facebook} twitter={params.data.sendStatus.twitter} />
        ),
        cellStyle: { fontSize: '12px', lineHeight: '23px' },
        headerClass: 'ag-grid-sns-meta-header',
    },
    {
        headerName: 'FB InstantArticle',
        headerClass: 'ag-grid-sns-meta-header',
        children: [
            {
                headerName: '상태',
                field: 'status',
                width: 80,
                /*cellRendererFramework: ({ value }) => {
                    let clazz = value === 'Y' ? 'color-primary' : 'color-gray150';
                    return <FontAwesomeIcon icon={faCircle} fixedWidth className={clazz} />;
                },*/
                cellStyle: { fontSize: '12px', lineHeight: '23px' },
                headerClass: 'ag-grid-sns-meta-header',
            },
            {
                headerName: '전송일',
                field: 'sendDt',
                width: 100,
                cellStyle: { fontSize: '12px', lineHeight: '23px' },
                headerClass: 'ag-grid-sns-meta-header',
            },
            {
                headerName: '전송',
                field: 'insStatus',
                width: 65,
                cellRendererFramework: (params) => <ButtonStatusRenderer hasButtons={params.data.hasSnsArticleSendButtons} />,
                headerClass: 'ag-grid-sns-meta-header',
            },
        ],
    },
];
