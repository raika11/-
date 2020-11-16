import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import { CARD_DEFAULT_HEIGHT } from '@/constants';

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
     * 전체 영역 width
     */
    width: PropTypes.number,
    /**
     * 탭 컨텐츠의 className
     */
    tabContentClass: PropTypes.string,
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
    tabNavs: PropTypes.arrayOf(PropTypes.string),
};
const defaultProps = {
    width: 410,
    height: CARD_DEFAULT_HEIGHT,
    fill: false,
    tabs: [],
    tabNavs: [],
};

/**
 * 카드모양 + 탭
 */
const MokaCardTabs = (props) => {
    const { className, fill, id, tabs, tabNavs, width, height, tabContentClass } = props;

    return (
        <div className={clsx('tab', 'card-tab', 'flex-fill', className)} style={{ width, height }}>
            <Tab.Container id={id} defaultActiveKey={0}>
                <div className="d-flex">
                    <Nav fill={fill} variant="tabs" className="flex-row">
                        {tabNavs.map((nav, idx) => (
                            <Nav.Item key={idx}>
                                <Nav.Link eventKey={idx} className="h5">
                                    {nav}
                                </Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                </div>
                <div className="d-flex custom-scroll">
                    <Tab.Content className={clsx('p-0', tabContentClass)}>
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
