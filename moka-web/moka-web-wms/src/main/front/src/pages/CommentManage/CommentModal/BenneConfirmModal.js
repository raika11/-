import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { MokaModal } from '@components';

const BenneConfirmModal = (props) => {
    const { show, onHide, ModalUsage } = props;

    const [modalState, setModalState] = useState({
        title: '',
        content: '',
    });

    const handleClickSave = () => {
        onHide();
    };
    const handleClickHide = () => {
        onHide();
    };

    useEffect(() => {
        if (ModalUsage.title && ModalUsage.content && show) {
            setModalState({
                title: ModalUsage.title,
                content: ModalUsage.content,
            });
        }
    }, [ModalUsage, show]);
    return (
        <MokaModal
            width={600}
            show={show}
            onHide={handleClickHide}
            title={modalState.title}
            size="md"
            buttons={[
                { text: '확인', variant: 'positive', onClick: () => handleClickSave() },
                { text: '취소', variant: 'negative', onClick: () => handleClickHide() },
            ]}
            footerClassName="justify-content-center"
            draggable
        >
            <Form>
                <Form.Row className="mb-2">{modalState.content}</Form.Row>
            </Form>
        </MokaModal>
    );
};

export default BenneConfirmModal;
