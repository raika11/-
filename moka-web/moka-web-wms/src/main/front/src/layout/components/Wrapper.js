import React from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const propTypes = {
    /**
     * 추가하는 className
     */
    className: PropTypes.string,
};
const defaultProps = {};

/**
 * 기본 Wrapper
 */
const Wrapper = ({ children, className }) => {
    const { isBoxed } = useSelector((store) => ({
        isBoxed: store.layout.isBoxed,
    }));

    return (
        <div
            className={clsx(
                'wrapper',
                {
                    'wrapper-boxed': isBoxed,
                },
                className,
            )}
        >
            {children}
        </div>
    );
};

Wrapper.propTypes = propTypes;
Wrapper.defaultProps = defaultProps;

export default Wrapper;
