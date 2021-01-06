import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SortableContainer from '@pages/Survey/component/sortable/SortableContainer';

const Sortable = ({ items }) => {
    return (
        <DndProvider backend={HTML5Backend}>
            <SortableContainer items={items} />
        </DndProvider>
    );
};

export default Sortable;
