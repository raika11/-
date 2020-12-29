import React from 'react';
import { MokaModal } from '@components';
import RelationPollModalSearchComponent from '@pages/Survey/Poll/components/RelationPollModalSearchComponent';
import RelationPollModalAgGridComponent from '@pages/Survey/Poll/components/RelationPollModalAgGridComponent';

const RelationPollModal = ({ show, onHide }) => {
    return (
        <MokaModal title="관련 투표 팝업" show={show} onHide={onHide} size="md" width={600}>
            <RelationPollModalSearchComponent />
            <RelationPollModalAgGridComponent />
        </MokaModal>
    );
};

export default RelationPollModal;
