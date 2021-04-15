import { ArticleRenderer } from './ColumnRenderer';

const artColumnDefs = [
    {
        rowDrag: true,
        width: 24,
        maxWidth: 24,
        suppressMenu: true,
        rowDragText: (params) => params.rowNode.data.artTitle,
    },
    {
        field: 'title',
        flex: 1,
        cellRendererFramework: ArticleRenderer,
    },
];

export { artColumnDefs };
