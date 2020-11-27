import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

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
    const { title, icon, headerClassName, message } = props;

    return (
        <div className="message-box">
            {title ? (
                <div className={clsx('modal-header', headerClassName)}>
                    {icon ? <div className="modal-icon h3 mr-10 mb-0">{icon}</div> : ''}
                    <div className="modal-title h4">{title}</div>
                </div>
            ) : (
                ''
            )}
            <div className="modal-body pd-20">
                <div className="message" dangerouslySetInnerHTML={{ __html: message }} />
            </div>
        </div>
    );
};
MokaMessageBox.propTypes = propTypes;

export default MokaMessageBox;
