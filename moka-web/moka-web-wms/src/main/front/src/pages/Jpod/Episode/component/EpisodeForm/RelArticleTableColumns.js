import RelArticleRenderer from './RelArticleRenderer';
const replaceNo = (t) => ('00' + t).slice(-2);

export default [
    {
        headerName: '',
        rowDrag: true,
        width: 24,
        maxWidth: 24,
        rowDragText: (params) => params.rowNode.data.relTitle,
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
    },
    {
        headerName: '',
        field: 'article',
        flex: 1,
        cellRendererFramework: RelArticleRenderer,
    },
];
