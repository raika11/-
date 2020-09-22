import React from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';

const Wrapper = ({ children }) => {
    const { isBoxed } = useSelector((state) => ({
        isBoxed: state.layout.isBoxed
    }));

    return (
        <div
            className={clsx('wrapper', {
                'wrapper-boxed': isBoxed
            })}
        >
            {children}
        </div>
    );
};

export default Wrapper;
