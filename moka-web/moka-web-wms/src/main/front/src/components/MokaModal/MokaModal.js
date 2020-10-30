import React, { useCallback } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ModalDialog from 'react-bootstrap/ModalDialog';

const propTypes = {
    /**
     * width
     */
    width: PropTypes.number,
    /**
     * height
     */
    height: PropTypes.number,
    /**
     * className
     */
    className: PropTypes.string,
    /**
     * headerClassName
     */
    headerClassName: PropTypes.string,
    /**
     * bodyClassName
     */
    bodyClassName: PropTypes.string,
    /**
     * footerClassName (buttons이 있을 경우에만 생김)
     */
    footerClassName: PropTypes.string,
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
    /**
     * 로딩 여부
     */
    loading: PropTypes.bool,
};

const defaultProps = {
    title: '',
    draggable: false,
    centered: false,
    loading: false,
};

/**
 * 기본 모달
 * DraggableModal이지만, draggable이 false인 경우 핸들을 제거
 */
const MokaModal = (props) => {
    const { width, height, show, onHide, title, children, buttons, draggable, centered, className, headerClassName, bodyClassName, footerClassName, loading, ...rest } = props;

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
                    <ModalDialog style={{ width, height }} className={className} {...props} />
                </Draggable>
            </div>
        ),
        [centered, className, height, width],
    );

    return (
        <Modal aria-labelledby={title} show={show} onHide={onHide} backdrop={false} animation={false} scrollable="true" dialogAs={DraggableModal} enforceFocus={false} {...rest}>
            {/* 타이틀 */}
            <Modal.Header className={headerClassName} id="draggable-modal-title" data-drag-on={draggable} closeButton>
                {draggable && <div id="draggable-handle" />}
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            {/* 컨텐츠 */}
            <Modal.Body className={bodyClassName}>
                {children}
                {loading && <div className="opacity-box"></div>}
            </Modal.Body>

            {/* 푸터 버튼 */}
            {buttons && (
                <Modal.Footer className={footerClassName}>
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
