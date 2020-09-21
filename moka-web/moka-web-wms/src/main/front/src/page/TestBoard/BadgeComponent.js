import React from 'react';
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
    const { pill, variant, title, className, ...rest } = props;

    return (
        <Badge pill={pill && true} variant={variant} className={className} {...rest}>
            {title}
        </Badge>
    );
};

BadgeComponent.defaultProps = defaultProps;
BadgeComponent.propTypes = propTypes;

export default BadgeComponent;
