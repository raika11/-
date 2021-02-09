import { ListTitleRenderer, ButtonStatusRenderer, SendStatusRenderer } from './component';

export default [
    {
        headerName: 'ID',
        field: 'id',
        width: 70,
        cellStyle: { lineHeight: '23px' },
        headerClass: 'ag-grid-sns-meta-header',
    },
    {
        headerName: '출고일',
        headerClass: 'ag-grid-sns-meta-header',
        field: 'forwardDate',
        width: 90,
        cellStyle: { lineHeight: '23px' },
    },
    {
        headerName: '이미지',
        field: 'thumbnail',
        headerClass: 'ag-grid-sns-meta-header',
        cellRenderer: 'imageRenderer',
        cellStyle: { paddingTop: '1px', paddingBottom: '1px' },
        width: 90,
    },
    {
        headerName: '기사제목',
        headerClass: 'ag-grid-sns-meta-header',
        width: 135,
        children: [
            {
                headerName: 'SNS제목',
                field: 'listTitle',
                flex: 1,
                headerClass: 'ag-grid-sns-meta-header',
                cellStyle: { paddingTop: '1px', paddingBottom: '1px' },
                cellRendererFramework: ListTitleRenderer,
            },
        ],
    },
    {
        headerName: '전송상태',
        field: 'sendType',
        width: 85,
        cellRendererFramework: SendStatusRenderer,
        headerClass: 'ag-grid-sns-meta-header',
    },
    {
        headerName: 'FB InstantArticle',
        headerClass: 'ag-grid-sns-meta-header',
        children: [
            {
                headerName: '상태',
                field: 'status',
                width: 60,
                // cellRenderer: 'usedYnRenderer',
                headerClass: 'ag-grid-sns-meta-header',
            },
            {
                headerName: '전송일',
                field: 'sendDt',
                width: 100,
                cellStyle: { lineHeight: '23px' },
                headerClass: 'ag-grid-sns-meta-header',
            },
            {
                headerName: '전송',
                field: 'insStatus',
                width: 57,
                cellRendererFramework: ButtonStatusRenderer,
                headerClass: 'ag-grid-sns-meta-header',
            },
        ],
    },
];
