import RelArticleRenderer from './RelArticleRenderer';

const replaceNo = (t) => ('00' + t).slice(-2);
const suppressKeyboardEvent = () => true;

export default [
    {
        headerName: '',
        rowDrag: true,
        width: 28,
        maxWidth: 28,
        rowDragText: (params) => params.rowNode.data.relTitle || '제목없음',
        cellClass: 'ag-content-center-cell',
    },
    {
        headerName: '',
        field: 'ordNo',
        width: 28,
        maxWidth: 28,
        valueGetter: (params) => {
            return replaceNo(params.node.rowIndex + 1);
        },
        cellStyle: { display: 'flex', alignItems: 'center' },
        suppressKeyboardEvent,
    },
    {
        headerName: '',
        field: 'article',
        flex: 1,
        cellRendererFramework: RelArticleRenderer,
        suppressKeyboardEvent,
    },
];
