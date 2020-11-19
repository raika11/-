import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { MokaDeskingThumbCard } from '@components';

const EditThumbTable = (props) => {
    return (
        <div className="mb-3 border" style={{ height: 600 }}>
            <Droppable droppableId="table-1">
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} className="d-flex flex-wrap align-content-start custom-scroll p-05 w-100 overflow-y-scroll">
                        {[...Array(20)].map((x, idx) => (
                            <Draggable key={idx} draggableId={`draggable-${idx}`} index={idx}>
                                {(provided, snapshot) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                        <MokaDeskingThumbCard data={{ name: `${x}-테스트` }} />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default EditThumbTable;
