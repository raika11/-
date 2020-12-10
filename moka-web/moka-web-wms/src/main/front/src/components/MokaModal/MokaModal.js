import React, { useCallback } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ModalDialog from 'react-bootstrap/ModalDialog';
import { MokaLoader } from '@components';

const propTypes = {
    /**
     * 핸들에 추가되는 id string (modal이 여러개인 경우 필수적으로 넘겨 중복 id 생성을 막는다)
     */
    id: PropTypes.string,
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
     * node 타입 Modal타이틀 (titleAs가 있으면 title이 노출되지 않는다)
     */
    titleAs: PropTypes.node,
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
    /**
     * 모달 사이즈
     * sm) max-width = 400 ==> 토스트와 동일한 버튼 형태
     * md) max-width = 600 ==> 토스트와 동일한 버튼 형태
     * lg) max-width = 900
     * xl) max-width = 1200
     */
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
};

const defaultProps = {
    title: '',
    draggable: false,
    centered: false,
    loading: false,
    id: '',
    size: 'md',
};

/**
 * 기본 모달
 * DraggableModal이지만, draggable이 false인 경우 핸들을 제거
 */
const MokaModal = (props) => {
    const {
        width,
        height,
        show,
        onHide,
        title,
        titleAs,
        children,
        buttons,
        draggable,
        centered,
        className,
        headerClassName,
        bodyClassName,
        footerClassName,
        loading,
        id,
        size,
        ...rest
    } = props;

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
                <Draggable handle={`#draggable-handle-${id}`} allowAnyClick={true} bounds="parent">
                    <ModalDialog style={{ width, height }} className={className} {...props} />
                </Draggable>
            </div>
        ),
        [centered, className, height, id, width],
    );

    return (
        <Modal
            aria-labelledby={title}
            show={show}
            onHide={onHide}
            backdrop={false}
            animation={false}
            scrollable="true"
            dialogAs={DraggableModal}
            enforceFocus={false}
            size={size}
            {...rest}
        >
            {/* 타이틀 */}
            <Modal.Header className={headerClassName} id="draggable-modal-title" data-drag-on={draggable} closeButton>
                {draggable && <div id={`draggable-handle-${id}`} data-drag-handle="true" />}
                {titleAs ? titleAs : <Modal.Title>{title}</Modal.Title>}
            </Modal.Header>

            {/* 컨텐츠 */}
            <Modal.Body className={bodyClassName}>
                {children}
                {loading && <MokaLoader />}
            </Modal.Body>

            {/* 푸터 버튼 */}
            {buttons && (
                <Modal.Footer
                    className={clsx(footerClassName, {
                        'toast-footer': size === 'sm' || size === 'md',
                    })}
                >
                    {buttons.map(({ variant, text, ...rest }, idx) => (
                        <Button key={`${text}-${idx}`} variant={variant} data-color={variant} {...rest}>
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
