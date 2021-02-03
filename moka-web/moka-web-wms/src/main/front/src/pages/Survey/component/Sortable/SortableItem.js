import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from '@pages/Desking/modals/EditThumbModal/EditThumbCard';

const SortableItem = ({ id, item, moveItem, findItem }) => {
    const originalIndex = findItem(id).index;

    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.GIF, id, originalIndex },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (dropResult, monitor) => {
            const { id: droppedId, originalIndex } = monitor.getItem();
            const didDrop = monitor.didDrop();

            if (!didDrop) {
                moveItem(droppedId, originalIndex);
            }
        },
    });

    const [, drop] = useDrop({
        accept: ItemTypes.GIF,
        canDrop: () => false,
        /*drop({ id: draggedId }) {
            if (draggedId !== id) {
                const { index: overIndex } = findItem(id);
                moveItem(draggedId, overIndex);
            }
        },*/
        hover({ id: draggedId }, monitor) {
            if (draggedId !== id) {
                const { index: overIndex } = findItem(id);
                moveItem(draggedId, overIndex);
            }
            /*console.log(monitor.didDrop());*/
            /*monitor.isOver({ shallow: true });*/
        },
    });

    const opacity = isDragging ? 0.5 : 1;
    return (
        <div ref={(node) => drag(drop(node))} style={{ opacity }}>
            {item}
        </div>
    );
};

export default SortableItem;
