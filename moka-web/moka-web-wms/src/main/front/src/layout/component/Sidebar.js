import React from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';

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
            <div className="sidebar-content">
                <PerfectScrollbar>
                    <Link className="sidebar-brand" to="/">
                        <span className="align-middle">The JoongAng</span>
                    </Link>
                </PerfectScrollbar>
            </div>
        </nav>
    );
};

export default Sidebar;
