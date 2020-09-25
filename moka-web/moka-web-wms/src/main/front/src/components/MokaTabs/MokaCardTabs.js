import React from 'react';
import clsx from 'clsx';

import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';

const MokaTabs = (props) => {
    const { className } = props;

    return (
        <div className={clsx('tab', 'card-tab', className)}>
            <Tab.Container id={`tab-${Math.ceil(Math.random() * 10)}`} defaultActiveKey="first">
                <div className="d-flex">
                    <Nav fill variant="tabs">
                        <Nav.Item>
                            <Nav.Link eventKey="first">Tab 1</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="second">Tab 2</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </div>
                <div className="d-flex">
                    <Tab.Content>
                        <Tab.Pane eventKey="first">
                            <p>Test1</p>
                        </Tab.Pane>
                        <Tab.Pane eventKey="second">
                            <p>Test2</p>
                        </Tab.Pane>
                    </Tab.Content>
                </div>
            </Tab.Container>
        </div>
    );
};

export default MokaTabs;
