import React, { useState, useEffect } from 'react';
import Badge from 'react-bootstrap/Badge';
import PropTypes from 'prop-types';

const propTypes = {
    /**
     * pill
     */
    pill: PropTypes.bool,
    /**
     * variant
     */
    variant: PropTypes.string,
    /**
     * title
     */
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

const defaultProps = {
    variant: 'dark',
    title: ''
};

const BadgeComponent = (props) => {
    const { variant, title, className, ...rest } = props;
    const [pill, setPill] = useState();

    useEffect(() => {
        /** pill */
        setPill(
            <Badge pill variant={variant} className={className} {...rest}>
                {title}
            </Badge>
        );
    }, [pill]);

    return (
        <Badge variant={variant} className={className} {...rest}>
            {title}
        </Badge>
    );
};

BadgeComponent.defaultProps = defaultProps;
BadgeComponent.propTypes = propTypes;

export default BadgeComponent;
