import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import { toggleSidebar } from '@store/layout/action';

const MokaNavbar = () => {
    const dispatch = useDispatch();

    const onToggleSidebar = () => {
        dispatch(toggleSidebar());
    };

    return (
        <Navbar bg="white" expanded>
            {/* sidebar toggle button */}
            <span className="sidebar-toggle d-flex mr-2" onClick={onToggleSidebar}>
                <i className="hamburger align-self-center" />
            </span>

            {/* nav content */}
            <Nav className="mr-auto" navbar>
                <Nav.Link to="/404" as={NavLink}>
                    404
                </Nav.Link>
                <Nav.Link to="/dashboard" as={NavLink}>
                    dashboard
                </Nav.Link>
                <Nav.Link to="/test" as={NavLink}>
                    test
                </Nav.Link>
            </Nav>
            {/* Navbar menu 축소시 toggle, collapse 처리 */}
            {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
            {/* <Navbar.Collapse id="basic-navbar-nav" /> */}
        </Navbar>
    );
};

export default MokaNavbar;
