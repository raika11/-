import { GRID_LINE_HEIGHT } from '@/style_constants';
import { ListTitleRenderer, ButtonStatusRenderer, SendStatusRenderer } from './component';

const cellClassRules = {
    'ag-center-cell': () => true,
};

export default [
    {
        headerName: 'ID',
        field: 'id',
        cellClassRules,
        width: 70,
    },
    {
        headerName: '출고일',
        field: 'forwardDate',
        cellClassRules,
        width: 90,
    },
    {
        headerName: '이미지',
        field: 'thumbnail',
        // cellRenderer: 'editImageRenderer',
        cellRenderer: 'imageRenderer',
        width: 78,
    },
    {
        headerName: '기사제목',
        width: 135,
        children: [
            {
                headerName: 'SNS제목',
                field: 'listTitle',
                flex: 1,
                cellStyle: { lineHeight: `${GRID_LINE_HEIGHT.M}px` },
                cellRendererFramework: ListTitleRenderer,
            },
        ],
    },
    {
        headerName: '전송상태',
        field: 'sendType',
        width: 85,
        cellRendererFramework: SendStatusRenderer,
    },
    {
        headerName: 'FB InstantArticle',
        children: [
            {
                headerName: '상태',
                field: 'status',
                cellClassRules,
                width: 60,
                // cellRenderer: 'usedYnRenderer',
            },
            {
                headerName: '전송일',
                field: 'sendDt',
                cellClassRules,
                width: 100,
            },
            {
                headerName: '전송',
                field: 'insStatus',
                width: 57,
                cellRendererFramework: ButtonStatusRenderer,
            },
        ],
    },
];
