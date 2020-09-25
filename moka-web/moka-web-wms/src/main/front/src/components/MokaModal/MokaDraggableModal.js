import React from 'react';
import Draggable from 'react-draggable';
import ModalDialog from 'react-bootstrap/ModalDialog';
import PropTypes from 'prop-types';

import MokaModal from './MokaModal';

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
};

const defaultProps = {
    title: '',
};

const DraggableComponent = (props) => (
    <Draggable handle="#draggable-handle" allowAnyClick={false}>
        <ModalDialog {...props} />
    </Draggable>
);

/**
 * 드래그 가능한 모달
 */
const MokaDraggableModal = (props) => {
    const { show, onHide, title, children, actionButtons, ...rest } = props;

    return <MokaModal show={show} onHide={onHide} title={title} children={children} actionButtons={actionButtons} dialogAs={DraggableComponent} {...rest} />;
};

MokaDraggableModal.defaultProps = defaultProps;
MokaDraggableModal.propTypes = propTypes;

export default MokaDraggableModal;
