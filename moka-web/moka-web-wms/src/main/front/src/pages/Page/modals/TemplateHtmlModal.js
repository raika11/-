import React from 'react';
import { MokaModal, MokaEditor } from '@components';

const TemplateHtmlModal = (props) => {
    const { show, onHide } = props;

    return (
        <MokaModal
            show={show}
            onHide={onHide}
            draggable
            size="lg"
            buttons={[
                { text: '저장', variant: 'primary' },
                { text: '닫기', variant: 'gray150' },
            ]}
        >
            <MokaEditor />
        </MokaModal>
    );
};

export default TemplateHtmlModal;
