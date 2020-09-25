import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

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
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    /**
     * footer의 액션버튼
     */
    actionButtons: PropTypes.arrayOf(
        PropTypes.shape({
            variant: PropTypes.string,
            buttonName: PropTypes.string,
            onClick: PropTypes.func,
        }),
    ),
    dialogAs: PropTypes.elementType,
};

const defaultProps = {
    title: '',
};

/**
 * 기본 모달
 */
const MokaModal = (props) => {
    const { show, onHide, title, children, actionButtons, dialogAs, ...rest } = props;

    return (
        <Modal aria-labelledby={title} show={show} onHide={onHide} backdrop={false} animation={false} scrollable="true" dialogAs={dialogAs} enforceFocus={false} {...rest}>
            {/* 타이틀 */}
            <Modal.Header id="draggable-modal-title" closeButton>
                <div id="draggable-handle" />
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            {/* 컨텐츠 */}
            <Modal.Body>{children}</Modal.Body>

            {/* 액션 */}
            {actionButtons && (
                <Modal.Footer>
                    {actionButtons.map(({ variant, buttonName, ...rest }, idx) => (
                        <Button key={`${buttonName}-${idx}`} variant={variant} {...rest}>
                            {buttonName}
                        </Button>
                    ))}
                </Modal.Footer>
            )}
        </Modal>
    );
};

MokaModal.defaultProps = defaultProps;
MokaModal.propTypes = propTypes;

export default MokaModal;
