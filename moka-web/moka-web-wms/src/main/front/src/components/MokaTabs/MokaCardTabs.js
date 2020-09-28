import React from 'react';
import clsx from 'clsx';

import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';

const MokaTabs = (props) => {
    const { className, fill, id, tabs, tabNavs } = props;

    return (
        <div className={clsx('tab', 'card-tab', className)}>
            <Tab.Container id={id} defaultActiveKey={0}>
                <div className="d-flex">
                    <Nav fill={fill} variant="tabs">
                        {tabNavs.map((nav, idx) => (
                            <Nav.Item key={idx}>
                                <Nav.Link eventKey={idx}>{nav}</Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                </div>
                <div className="d-flex">
                    <Tab.Content>
                        {tabs.map((tab, idx) => (
                            <Tab.Pane key={idx} eventKey={idx}>
                                {tab}
                            </Tab.Pane>
                        ))}
                    </Tab.Content>
                </div>
            </Tab.Container>
        </div>
    );
};

export default MokaTabs;
