import React, { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import SortableItem from '@pages/Survey/component/Sortable/SortableItem';
import clsx from 'clsx';
import { ItemTypes } from '@pages/Desking/modals/EditThumbModal/ThumbCard';

const SortableContainer = ({ items }) => {
    const [sortableItems, setSortableItems] = useState([]);

    const moveItem = (id, atIndex) => {
        const { card, index } = findItem(id);

        const copyItems = [...sortableItems];
        copyItems.splice(index, 1);
        copyItems.splice(atIndex, 0, card);

        setSortableItems(copyItems);
    };

    const findItem = (id) => {
        const card = sortableItems.filter((c) => `${c.id}` === id)[0];
        return {
            card,
            index: sortableItems.indexOf(card),
        };
    };

    const [, drop] = useDrop({
        accept: ItemTypes.GIF,
    });

    useEffect(() => {
        setSortableItems(items);
    }, [items]);

    return (
        <div ref={drop}>
            {sortableItems.map((item) => (
                <SortableItem key={item.id} id={`${item.id}`} item={item.item} moveItem={moveItem} findItem={findItem} />
            ))}
        </div>
    );
};

export default SortableContainer;
