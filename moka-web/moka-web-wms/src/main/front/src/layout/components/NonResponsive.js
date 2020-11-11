import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const propTypes = {
    /**
     * 추가하는 className
     */
    className: PropTypes.string,
};
const defaultProps = {};

/**
 * 고정형 Wrapper
 */
const NonResponsive = ({ children, className }) => <div className={clsx('wrapper-fix', className)}>{children}</div>;

NonResponsive.propTypes = propTypes;
NonResponsive.defaultProps = defaultProps;

export default NonResponsive;
