import { ArticleRenderer, LiveRenderer, PacketRenderer, MPRenderer, BannerRenderer, KeywordRenderer } from './ColumnRenderer';

const suppressKeyboardEvent = () => true;

const artColumnDefs = [
    {
        rowDrag: true,
        width: 28,
        maxWidth: 28,
        suppressMenu: true,
        rowDragText: (params) => params.rowNode.data.title,
        cellClass: 'ag-content-center-cell',
    },
    {
        field: 'title',
        flex: 1,
        cellRendererFramework: ArticleRenderer,
        suppressKeyboardEvent,
    },
];

const liveColumnDefs = [
    {
        field: 'title',
        flex: 1,
        cellRendererFramework: LiveRenderer,
        suppressKeyboardEvent,
    },
];

const packetColumnDefs = [
    {
        rowDrag: true,
        width: 24,
        maxWidth: 24,
        suppressMenu: true,
        rowDragText: (params) => params.rowNode.data.title,
        cellClass: 'ag-content-center-cell',
    },
    {
        field: 'title',
        flex: 1,
        cellRendererFramework: PacketRenderer,
        cellStyle: {
            paddingLeft: '8px',
        },
        suppressKeyboardEvent,
    },
];

const moviePhotoColumnDefs = [
    {
        rowDrag: true,
        width: 24,
        maxWidth: 24,
        suppressMenu: true,
        rowDragText: (params) => params.rowNode.data.title,
        cellClass: 'ag-content-center-cell',
    },
    {
        field: 'title',
        flex: 1,
        cellRendererFramework: MPRenderer,
        suppressKeyboardEvent,
        cellStyle: {
            paddingTop: '6px',
            paddingBottom: '6px',
        },
    },
];

const bannerColumnDefs = [
    {
        field: 'title',
        flex: 1,
        cellRendererFramework: BannerRenderer,
        suppressKeyboardEvent,
    },
];

const keywordColumnDefs = [
    {
        field: 'title',
        flex: 1,
        cellRendererFramework: KeywordRenderer,
        suppressKeyboardEvent,
    },
];

export { artColumnDefs, liveColumnDefs, packetColumnDefs, moviePhotoColumnDefs, bannerColumnDefs, keywordColumnDefs };
