import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

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
     * dismissible이 true일 때 onClick 필수
     */
    onClose: PropTypes.func,
    /**
     * children
     */
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    /**
     * className
     */
    className: PropTypes.string
};

const defaultProps = {
    variant: 'primary',
    outline: false,
    dismissible: false
};

/**
 * icon, outline 추가한 Alert
 */
const MokaAlert = forwardRef((props, ref) => {
    const { outline, variant, icon, dismissible, children, className, onClose, ...rest } = props;

    return (
        <Alert
            ref={ref}
            className={className}
            variant={variant}
            dismissible={dismissible}
            onClose={onClose}
            bsPrefix={outline ? 'alert-outline' : undefined}
            {...rest}
        >
            {icon && <div className="alert-icon">{icon}</div>}
            <div className="alert-message">{children}</div>
        </Alert>
    );
});

MokaAlert.propTypes = propTypes;
MokaAlert.defaultProps = defaultProps;
MokaAlert.Link = Alert.Link;
MokaAlert.Heading = Alert.Heading;

export default MokaAlert;
