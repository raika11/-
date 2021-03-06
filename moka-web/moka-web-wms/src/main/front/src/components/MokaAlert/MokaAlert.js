import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import Alert from 'react-bootstrap/Alert';

const propTypes = {
    /**
     * variant
     */
    variant: PropTypes.string,
    /**
     * outline
     */
    outline: PropTypes.bool,
    /**
     * icon
     */
    icon: PropTypes.node,
    /**
     * dismissible
     */
    dismissible: PropTypes.bool,
    /**
     * dismissible이 true일 때 show state
     */
    show: PropTypes.bool,
    /**
     * dismissible이 true일 때 onClick 필수
     */
    onHide: PropTypes.func,
    /**
     * children
     */
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    /**
     * className
     */
    className: PropTypes.string,
    /**
     * alert body 영역의 className
     */
    bodyClassName: PropTypes.string,
};

const defaultProps = {
    show: true,
    variant: 'primary',
    outline: false,
    dismissible: false,
};

/**
 * icon, outline 추가한 Alert
 */
const MokaAlert = forwardRef((props, ref) => {
    const { show, outline, variant, icon, dismissible, children, className, onHide, bodyClassName, ...rest } = props;

    /**
     * 닫기 버튼
     */
    const handleClose = () => {
        if (onHide) onHide();
    };

    if (show) {
        return (
            <Alert
                ref={ref}
                className={clsx(className, {
                    'alert-outline': outline,
                })}
                variant={variant}
                dismissible={show && dismissible}
                onClose={handleClose}
                {...rest}
            >
                {icon && <div className="alert-icon">{icon}</div>}
                <div className={clsx('alert-message', bodyClassName)}>{children}</div>
            </Alert>
        );
    } else {
        return null;
    }
});

MokaAlert.propTypes = propTypes;
MokaAlert.defaultProps = defaultProps;
MokaAlert.Link = Alert.Link;
MokaAlert.Heading = Alert.Heading;

export default MokaAlert;
