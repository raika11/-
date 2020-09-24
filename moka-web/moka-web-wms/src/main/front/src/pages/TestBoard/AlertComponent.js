import React from 'react';
import PropTypes from 'prop-types';
import MokaAlert from '@components/MokaAlert';

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
        <MokaAlert variant={variant} {...rest}>
            {title && <MokaAlert.Heading>{title}</MokaAlert.Heading>}
            {children}
        </MokaAlert>
    );
};

AlertComponet.propTypes = propTypes;

export default AlertComponet;
