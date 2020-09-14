import React, { useState } from 'react';
import { Button, Modal, ModalDialog } from 'react-bootstrap';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';

const DraggableModalDialog = (props) => {
    return (
        <Draggable handle="#draggable-modal-title">
            <ModalDialog {...props} />
        </Draggable>
    );
};

const MokaDraggableModal = (props) => {
    const { btnTitle, title, content, ...rest } = props;
    const [show, setShow] = useState(false);

    return (
        <>
            <Button variant="primary" className="mr-2" onClick={() => setShow(true)}>
                {btnTitle}
            </Button>
            <Modal
                aria-labelledby="draggable-modal-title"
                show={show}
                onHide={() => setShow(false)}
                backdrop="static"
                scrollable="true"
                dialogAs={DraggableModalDialog}
                {...rest}
            >
                {/* 타이틀 */}
                <Modal.Header id="draggable-modal-title" closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>

                {/* 컨텐츠 */}
                {content && <Modal.Body className="text-center m-3">{content}</Modal.Body>}

                {/* 액션 */}
                <Modal.Footer>
                    <Button variant="primary">저장</Button>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        닫기
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

MokaDraggableModal.propTypes = {
    title: PropTypes.string,
    content: PropTypes.string
};

export default MokaDraggableModal;
