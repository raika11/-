import React from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import ModalDialog from 'react-bootstrap/ModalDialog';
import { Button, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

const DraggableComponent = (props) => (
    <Draggable handle="#draggable-modal-title" allowAnyClick={false}>
        <ModalDialog contentClassName="react-resizable" {...props} />
    </Draggable>
);

const propTypes = {
    width: PropTypes.number,
    height: PropTypes.number
};
const defaultProps = { width: 500, height: 500 };

const MokaResizableModal = (props) => {
    const {
        show,
        onHide,
        title,
        children,
        actionButtons,
        width,
        height,
        draggable,
        ...rest
    } = props;

    return (
        <Modal
            aria-labelledby="draggable-modal-title"
            show={show}
            onHide={onHide}
            backdrop={false}
            animation={false}
            scrollable="true"
            dialogAs={draggable && DraggableComponent}
            {...rest}
        >
            <ResizableBox
                width={height}
                height={width}
                minConstraints={[width, height]}
                maxConstraints={[window.innerWidth - 64, window.innerHeight - 64]}
            >
                <>
                    {/* 타이틀 */}
                    <Modal.Header id="draggable-modal-title" closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>

                    {/* 컨텐츠 */}
                    <Modal.Body>{children}</Modal.Body>

                    {/* 액션 */}
                    <Modal.Footer>
                        <Button variant="primary">저장</Button>
                        <Button variant="secondary" onClick={onHide}>
                            닫기
                        </Button>
                    </Modal.Footer>
                </>
            </ResizableBox>
        </Modal>
    );
};

MokaResizableModal.defaultProps = defaultProps;
MokaResizableModal.propTypes = propTypes;

export default MokaResizableModal;
