import React from 'react';
import { MokaModal } from '@components';
import { Figure } from 'react-bootstrap';

const PollLayoutInfoModal = ({ show, onHide }) => {
    return (
        <MokaModal show={show} onHide={onHide} title="레이아웃 정보" draggable={true} size="xl" width={900}>
            <Figure.Image src="/images/poll/poll-layout-info.png" />
        </MokaModal>
    );
};

export default PollLayoutInfoModal;
