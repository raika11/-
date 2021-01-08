import React from 'react';
import { MokaModal } from '@/components';

const AgendaOrderModal = (props) => {
    const { show, onHide } = props;

    return (
        <MokaModal title="아젠다 순서" show={show} onHide={onHide} size="sm">
            test
        </MokaModal>
    );
};

export default AgendaOrderModal;
