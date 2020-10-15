import React, { useCallback } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ModalDialog from 'react-bootstrap/ModalDialog';

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
     * footer의 버튼
     */
    buttons: PropTypes.arrayOf(
        PropTypes.shape({
            variant: PropTypes.string,
            text: PropTypes.string,
            onClick: PropTypes.func,
        }),
    ),
    /**
     * 드래그 기능
     */
    draggable: PropTypes.bool,
    /**
     * 첫 위치를 align-items-center로 설정
     */
    centered: PropTypes.bool,
};

const defaultProps = {
    title: '',
    draggable: false,
    centered: false,
};

/**
 * 기본 모달
 * DraggableModal이지만, draggable이 false인 경우 핸들을 제거
 */
const MokaModal = (props) => {
    const { show, onHide, title, children, buttons, draggable, centered, ...rest } = props;

    /**
     * draggable 껍데기 컴포넌트 생성
     */
    const DraggableModal = useCallback(
        (props) => (
            <div
                className={clsx('react-draggable-container', {
                    'align-items-center': centered,
                })}
            >
                <Draggable handle="#draggable-handle" allowAnyClick={true} bounds="parent">
                    <ModalDialog {...props} />
                </Draggable>
            </div>
        ),
        [centered],
    );

    return (
        <Modal aria-labelledby={title} show={show} onHide={onHide} backdrop={false} animation={false} scrollable="true" dialogAs={DraggableModal} enforceFocus={false} {...rest}>
            {/* 타이틀 */}
            <Modal.Header id="draggable-modal-title" data-drag-on={draggable} closeButton>
                {draggable && <div id="draggable-handle" />}
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            {/* 컨텐츠 */}
            <Modal.Body>{children}</Modal.Body>

            {/* 푸터 버튼 */}
            {buttons && (
                <Modal.Footer>
                    {buttons.map(({ variant, text, ...rest }, idx) => (
                        <Button key={`${text}-${idx}`} variant={variant} {...rest}>
                            {text}
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
