import React from 'react';
import { MokaModal } from '@components';
import RelationPollModalSearchComponent from '@pages/Survey/Poll/components/RelationPollModalSearchComponent';
import RelationPollModalAgGridComponent from '@pages/Survey/Poll/components/RelationPollModalAgGridComponent';

const RelationPollModal = ({ show, onHide, onAdd, polls }) => {
    return (
        <MokaModal title="관련 투표 팝업" show={show} onHide={onHide} size="md" width={600} draggable>
            <RelationPollModalSearchComponent />
            <RelationPollModalAgGridComponent onAdd={onAdd} />
        </MokaModal>
    );
};

export default RelationPollModal;
