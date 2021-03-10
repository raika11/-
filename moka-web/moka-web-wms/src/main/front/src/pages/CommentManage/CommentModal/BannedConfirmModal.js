import React, { useEffect, useState } from 'react';
import { MokaModal } from '@components';

const BannedConfirmModal = (props) => {
    const { show, onHide, modalUsage } = props;

    const [modalState, setModalState] = useState({
        title: '',
        content: '',
        gubun: '',
    });

    const handleClickSave = () => {
        onHide({ gubun: modalState.gubun, type: 'save' });
    };
    const handleClickHide = () => {
        onHide({ gubun: modalState.gubun, type: 'cancle' });
    };

    useEffect(() => {
        if (modalUsage.title && modalUsage.content && show) {
            setModalState({
                title: modalUsage.title,
                content: modalUsage.content,
                gubun: modalUsage.gubun,
            });
        }
    }, [modalUsage, show]);

    return (
        <MokaModal
            size="sm"
            width={400}
            show={show}
            onHide={handleClickHide}
            title={modalState.title}
            buttons={[
                { text: '확인', variant: 'positive', onClick: handleClickSave },
                { text: '취소', variant: 'negative', onClick: handleClickHide },
            ]}
            id="bannedConfirmModal"
            draggable
        >
            <p className="mb-0">{modalState.content}</p>
        </MokaModal>
    );
};

export default BannedConfirmModal;
