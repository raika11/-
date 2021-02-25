import ItemRenderer from './ItemRenderer';

const suppressKeyboardEvent = () => true;

export const columnDefs = [
    {
        rowDrag: true,
        width: 24,
        maxWidth: 24,
        rowDragText: (params, dragItemCount) => {
            if (dragItemCount > 1) {
                const message = params.rowNodes ? params.rowNodes[0].data.title : '';
                return `${message} 외 [${dragItemCount - 1}건]`;
            }
            return params.rowNode.data.title;
        },
    },
    {
        field: 'ordNo',
        width: 30,
        maxWidth: 30,
    },
    {
        field: 'item',
        width: 400,
        flex: 1,
        suppressKeyboardEvent,
        cellRendererFramework: ItemRenderer,
        // cellStyle: { fontSize: '14px', lineHeight: '40px', paddingTop: '7px', alignItems: 'center' },
    },
];
