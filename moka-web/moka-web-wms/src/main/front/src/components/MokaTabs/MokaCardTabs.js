import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';

const propTypes = {
    /**
     * className
     */
    className: PropTypes.string,
    /**
     * Nav Item을 화면에 꽉 채울 것인지
     */
    fill: PropTypes.bool,
    /**
     * tab id
     */
    id: PropTypes.string,
    /**
     * tab 컨텐츠(array)
     */
    tabs: PropTypes.arrayOf(PropTypes.node),
    /**
     * tab 컨텐츠의 Nav(array), tab과 갯수가 동일해야한다
     */
    tabNav: PropTypes.arrayOf(PropTypes.string),
};
const defaultProps = {
    fill: false,
    tabs: [],
    tabNav: [],
};

/**
 * 카드모양의 탭
 */
const MokaCardTabs = (props) => {
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

MokaCardTabs.propTypes = propTypes;
MokaCardTabs.defaultProps = defaultProps;

export default MokaCardTabs;
