import RelArticleRenderer from './RelArticleRenderer';

export default [
    {
        headerName: '',
        rowDrag: true,
        width: 28,
        maxWidth: 28,
        rowDragText: (params) => params.rowNode.data.artTitle,
        cellClass: 'ag-content-center-cell',
    },
    {
        headerName: '',
        field: 'ordNo',
        flex: 1,
        cellRendererFramework: RelArticleRenderer,
    },
];
