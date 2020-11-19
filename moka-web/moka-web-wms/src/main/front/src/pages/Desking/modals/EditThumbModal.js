import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { MokaModal, MokaCardTabs } from '@components';
import { EditThumbTable } from '../components';

/**
 * 대표이미지 편집 모달 ====> 데스킹워크 저장 후 나중에 작업
 */
const EditThumbModal = (props) => {
    const { show, onHide } = props;
    return (
        <MokaModal
            title="대표 이미지 편집"
            show={show}
            onHide={onHide}
            size="lg"
            width={800}
            buttons={[{ text: '등록' }, { text: '취소', variant: 'gray150' }]}
            bodyClassName="p-0"
            footerClassName="d-flex justify-content-center"
            draggable
        >
            <DragDropContext>
                <MokaCardTabs height={300} className="shadow-none w-100" tabs={[<EditThumbTable />]} tabNavs={['아카이브', '본문 소재 리스트']} fill />
                <div className="mt-gutter">
                    <Droppable droppableId="droppable-1" type="GIF">
                        {(provided, snapshot) => (
                            <div ref={provided.innerRef} style={{ backgroundColor: snapshot.isDraggingOver ? 'blue' : 'grey' }} {...provided.droppableProps}>
                                <h2>I am a droppable!</h2>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </DragDropContext>
        </MokaModal>
    );
};

export default EditThumbModal;
