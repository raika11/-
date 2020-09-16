import React from 'react';
import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/ModalDialog';
import { Button, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

const DraggableComponent = (props) => (
    <Draggable handle="#draggable-modal-title" allowAnyClick={false}>
        <ModalDialog {...props} />
    </Draggable>
);

const propTypes = {
    /**
     * show
     */
    show: PropTypes.bool.isRequired,
    /**
     * hide함수
     */
    onHide: PropTypes.func.isRequired,
    /**
     * Modal타이틀
     */
    title: PropTypes.string,
    /**
     * children (컨텐츠)
     */
    children: PropTypes.element,
    /**
     * footer의 액션버튼
     */
    actionButtons: PropTypes.arrayOf(
        PropTypes.shape({
            variant: PropTypes.string,
            buttonName: PropTypes.string,
            onClick: PropTypes.func
        })
    )
};

const defaultProps = {
    title: '',
    children: undefined,
    actionButtons: undefined
};

const MokaDraggableModal = (props) => {
    const { show, onHide, title, children, actionButtons, ...rest } = props;

    return (
        <Modal
            aria-labelledby={title}
            show={show}
            onHide={onHide}
            backdrop={false}
            animation={false}
            scrollable="true"
            dialogAs={DraggableComponent}
            enforceFocus={false}
            {...rest}
        >
            {/* 타이틀 */}
            <Modal.Header id="draggable-modal-title" closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            {/* 컨텐츠 */}
            <Modal.Body>{children}</Modal.Body>

            {/* 액션 */}
            {actionButtons && (
                <Modal.Footer>
                    {actionButtons.map(({ variant, buttonName, ...rest }) => (
                        <Button variant={variant} {...rest}>
                            {buttonName}
                        </Button>
                    ))}
                </Modal.Footer>
            )}
        </Modal>
    );
};

MokaDraggableModal.defaultProps = defaultProps;
MokaDraggableModal.propTypes = propTypes;

export default MokaDraggableModal;
