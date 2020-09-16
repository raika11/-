import React from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';

// routes => api 변경
// import routes from '@/routes';

const Sidebar = (props) => {
    const { isOpen, isSticky } = useSelector((state) => ({
        isOpen: state.layout.isOpen,
        isSticky: state.layout.isSticky
    }));

    return (
        <nav
            className={clsx('sidebar', {
                toggled: !isOpen,
                'sidebar-sticky': isSticky
            })}
        >
            <div className="sidebar-content">TEST</div>
        </nav>
    );
};

export default Sidebar;
