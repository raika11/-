import React from 'react';
import { NavLink } from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const MokaNavbar = () => {
    return (
        <Navbar bg="white" expanded>
            <Navbar.Toggle aria-controls="basic-navbar-nav">
                <i className="hamburger align-self-center" />
            </Navbar.Toggle>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto" navbar>
                    <Nav.Link to="/404" as={NavLink}>
                        404
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default MokaNavbar;
