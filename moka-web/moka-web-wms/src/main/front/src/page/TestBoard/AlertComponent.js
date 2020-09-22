import React from 'react';
import Alert from 'react-bootstrap/Alert';
import PropTypes from 'prop-types';

const propTypes = {
    /**
     * variant
     */
    variant: PropTypes.string,
    /**
     * title
     */
    title: PropTypes.string,
    /**
     * children
     */
    children: PropTypes.string
};

const AlertComponet = (props) => {
    const { variant, title, children, ...rest } = props;

    return (
        <Alert variant={variant} {...rest}>
            {title && <Alert.Heading>{title}</Alert.Heading>}
            {children}
        </Alert>
    );
};

AlertComponet.propTypes = propTypes;

export default AlertComponet;
