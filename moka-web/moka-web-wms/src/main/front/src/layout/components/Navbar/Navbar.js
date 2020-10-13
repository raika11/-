import React from 'react';
import { useDispatch } from 'react-redux';

import Navbar from 'react-bootstrap/Navbar';
import Breadcrumb from './Breadcrumb';
import Profile from './Profile';
import NavButtons from './NavButtons';

import { toggleSidebar } from '@store/layout/layoutAction';

const MokaNavbar = ({ nonResponsive }) => {
    const dispatch = useDispatch();

    const onToggleSidebar = () => {
        dispatch(toggleSidebar());
    };

    return (
        <Navbar bg="white" className="pt-2 pb-2" expanded>
            <div className="d-flex justify-content-between align-items-center w-100 h-100">
                <div className="d-flex align-items-center">
                    {/* sidebar toggle button */}
                    {!nonResponsive && (
                        <span className="sidebar-toggle d-flex mr-2" onClick={onToggleSidebar}>
                            <i className="hamburger align-self-center" />
                        </span>
                    )}

                    {/* breadcrumb */}
                    <Breadcrumb />
                </div>

                <div className="d-flex align-items-center h-100">
                    <Profile />
                    <hr className="vertical-divider" />
                    <NavButtons />
                </div>
            </div>

            {/* Navbar menu 축소시 toggle, collapse 처리 */}
            {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
            {/* <Navbar.Collapse id="basic-navbar-nav" /> */}
        </Navbar>
    );
};

export default MokaNavbar;
