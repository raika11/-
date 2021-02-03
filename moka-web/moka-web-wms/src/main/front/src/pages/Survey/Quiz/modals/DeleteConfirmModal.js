import React from 'react';
// import { Form } from 'react-bootstrap';
import { MokaModal } from '@components';

const DeleteConfirmModal = (props) => {
    const { show, onHide } = props;
    const handleClickSave = () => {
        onHide({ type: 'save' });
    };
    const handleClickHide = () => {
        onHide({ type: 'cancle' });
    };

    return (
        <MokaModal
            width={600}
            show={show}
            onHide={handleClickHide}
            title={null}
            size="md"
            buttons={[
                { text: '확인', variant: 'positive', onClick: () => handleClickSave() },
                { text: '취소', variant: 'negative', onClick: () => handleClickHide() },
            ]}
            footerClassName="justify-content-center"
            draggable
        >
            {`퀴즈가 서비스 중입니다.\n 선택 문항을 삭제하시겠습니까.`}
        </MokaModal>
    );
};

export default DeleteConfirmModal;
