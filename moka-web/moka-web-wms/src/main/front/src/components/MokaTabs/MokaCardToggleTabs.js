import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { CARD_DEFAULT_HEIGHT } from '@/constants';

const propTypes = {
    /**
     * className
     */
    className: PropTypes.string,
    /**
     * 탭의 height
     */
    height: PropTypes.number,
    /**
     * 탭 컨텐츠 width
     */
    tabWidth: PropTypes.number,
    /**
     * tab 컨텐츠(array)
     */
    tabs: PropTypes.arrayOf(PropTypes.node),
    /**
     * 탭 Nav의 width
     */
    tabNavWidth: PropTypes.number,
    /**
     * tab 컨텐츠의 Nav(array), tab과 갯수가 동일해야한다
     */
    tabNavs: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            icon: PropTypes.node,
        }),
    ),
    /**
     * Tooltip 위치
     */
    placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    /**
     * 탭 확장(오픈)
     */
    expansion: PropTypes.bool,
    /**
     * 탭 확장 콜백
     */
    onExpansion: PropTypes.func,
};
const defaultProps = {
    tabs: [],
    height: CARD_DEFAULT_HEIGHT,
    tabWidth: 412,
    tabNavs: [],
    tabNavWidth: 48,
    placement: 'left',
    expansion: false,
    onExpansion: null,
};

/**
 * 카드모양의 탭
 * 버튼 토글로 탭 변경
 */
const MokaCardToggleTabs = (props) => {
    const { className, height, tabs, tabWidth, tabNavs, tabNavWidth, placement, expansion, onExpansion } = props;
    const [activeKey, setActiveKey] = useState(0);

    /**
     * 버튼 선택 이벤트
     * @param {any} eventKey 이벤트키
     */
    const handleSelect = (eventKey) => {
        if (!expansion) {
            if (typeof onExpansion === 'function') onExpansion(true);
            setActiveKey(eventKey);
        } else {
            if (activeKey.toString() === eventKey) {
                setActiveKey(-1);
                if (typeof onExpansion === 'function') onExpansion(false);
            } else {
                setActiveKey(eventKey);
                if (typeof onExpansion === 'function') onExpansion(true);
            }
        }
    };

    return (
        <div className={clsx('tab', 'card-toggle-tab', 'd-flex', className)} style={{ height }}>
            <Tab.Container defaultActiveKey={activeKey}>
                {/* 탭 컨텐츠 */}
                <Tab.Content
                    className={clsx('p-0', {
                        'd-none': !expansion,
                    })}
                    style={{ width: tabWidth }}
                >
                    {tabs.map((tab, idx) => (
                        <Tab.Pane key={idx} eventKey={idx}>
                            {tab}
                        </Tab.Pane>
                    ))}
                </Tab.Content>

                {/* 탭 Nav */}
                <Card className="mb-0" style={{ width: tabNavWidth }}>
                    <Card.Header>
                        <Card.Title>&nbsp;</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        {tabNavs.map((nav, idx) => (
                            <Nav.Item key={idx}>
                                <OverlayTrigger key={idx} placement={placement} overlay={<Tooltip id={`tooltip-${idx}-${nav.title}`}>{nav.title}</Tooltip>}>
                                    <Nav.Link as={Button} eventKey={idx} onSelect={handleSelect}>
                                        {nav.icon}
                                    </Nav.Link>
                                </OverlayTrigger>
                            </Nav.Item>
                        ))}
                    </Card.Body>
                </Card>
            </Tab.Container>
        </div>
    );
};

MokaCardToggleTabs.propTypes = propTypes;
MokaCardToggleTabs.defaultProps = defaultProps;

export default MokaCardToggleTabs;
