import React, { useState } from 'react';
import clsx from 'clsx';
import { Button, Modal, ModalDialog } from 'react-bootstrap';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import PropTypes from 'prop-types';

const DraggableModalDialog = (props) => {
    return (
        <Draggable handle="#draggable-modal-title">
            <ModalDialog {...props} />
        </Draggable>
    );
};

const MokaResizableModal = (props) => {
    const { btnTitle, title, content, width, height, ...rest } = props;
    const [show, setShow] = useState(false);

    return (
        <>
            <Button variant="primary" onClick={() => setShow(true)}>
                {btnTitle}
            </Button>
            <Modal
                aria-labelledby="draggable-modal-title"
                show={show}
                scrollable="true"
                dialogAs={DraggableModalDialog}
                {...rest}
            >
                <ResizableBox
                    height={300}
                    width={300}
                    // className={resizable}
                    minConstraints={[width, height]}
                    maxConstraints={[window.innerWidth - 64, window.innerHeight - 64]}
                >
                    {/* 타이틀 */}
                    <Modal.Header id="draggable-modal-title" closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>

                    {/* 컨텐츠 */}
                    {content && (
                        <Modal.Body className={clsx('text-center m-3', 'resizableBoxContent')}>
                            {content}
                        </Modal.Body>
                    )}

                    {/* 액션 */}
                    <Modal.Footer>
                        <Button variant="primary">저장</Button>
                        <Button variant="secondary" onClick={() => setShow(false)}>
                            닫기
                        </Button>
                    </Modal.Footer>
                </ResizableBox>
            </Modal>
        </>
    );
};

MokaResizableModal.propTypes = {
    title: PropTypes.string,
    content: PropTypes.element
};

export default MokaResizableModal;
