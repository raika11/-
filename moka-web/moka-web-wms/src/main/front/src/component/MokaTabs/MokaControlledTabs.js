import React, { useState } from 'react';
import { Tab, Nav, Row, Col, TabContent, TabPane } from 'react-bootstrap';

const MokaControlledTabs = () => {
    const [key, setKey] = useState('test');

    return (
        <Tab.Container id="mokaControlled-tabs" transition={false} defaultActiveKey="first">
            <Nav variant="pills">
                <Nav.Item>
                    <Nav.Link eventKey="first">Test 1</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="second">Test 2</Nav.Link>
                </Nav.Item>
            </Nav>
            <Tab.Content>
                <Tab.Pane eventKey="first">
                    <p>Test 1</p>
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                    <p>Test 2</p>
                </Tab.Pane>
            </Tab.Content>
        </Tab.Container>
    );
};

export default MokaControlledTabs;
