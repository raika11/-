import { ArticleRenderer, LiveRenderer, MPRenderer, BannerRenderer, KeywordRenderer } from './ColumnRenderer';

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

const liveColumnDefs = [
    {
        field: 'title',
        flex: 1,
        cellRendererFramework: LiveRenderer,
    },
];

const packetColumnDefs = [
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
        cellRendererFramework: LiveRenderer,
    },
];

const moviePhotoColumnDefs = [
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
        cellRendererFramework: MPRenderer,
    },
];

const bannerColumnDefs = [
    {
        field: 'title',
        flex: 1,
        cellRendererFramework: BannerRenderer,
    },
];

const keywordColumnDefs = [
    {
        field: 'title',
        flex: 1,
        cellRendererFramework: KeywordRenderer,
    },
];

export { artColumnDefs, liveColumnDefs, packetColumnDefs, moviePhotoColumnDefs, bannerColumnDefs, keywordColumnDefs };
