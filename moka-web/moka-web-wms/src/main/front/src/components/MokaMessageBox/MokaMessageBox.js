import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import ModalDialog from 'react-bootstrap/ModalDialog';

const propTypes = {
    /**
     * title
     */
    title: PropTypes.string,
    /**
     * icon
     */
    icon: PropTypes.object,
    /**
     * haderClassName
     */
    headerClassName: PropTypes.string,
    /**
     * message
     */
    message: PropTypes.string,
};

/**
 * icon, outline 추가한 Alert
 */
const MokaMessageBox = (props) => {
    const { title, headerClassName, message } = props;

    return (
        <ModalDialog className="message-box">
            {title && (
                <Modal.Header className={headerClassName}>
                    <Modal.Title as="h2">{title}</Modal.Title>
                </Modal.Header>
            )}

            <Modal.Body>
                <div className="message text-center" dangerouslySetInnerHTML={{ __html: message }} />
            </Modal.Body>
        </ModalDialog>
    );
};
MokaMessageBox.propTypes = propTypes;

export default MokaMessageBox;
