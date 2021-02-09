import RelArticleRenderer from './RelArticleRenderer';

export default [
    {
        headerName: '',
        rowDrag: true,
        width: 24,
        maxWidth: 24,
        rowDragText: (params) => params.rowNode.data.artTitle,
    },
    {
        headerName: '',
        field: 'ordNo',
        flex: 1,
        cellRendererFramework: RelArticleRenderer,
    },
];
