import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const propTypes = {
    /**
     * className
     */
    className: PropTypes.string,
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
            icon: PropTypes.object,
        }),
    ),
    /**
     * Tooltip 위치
     */
    placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
};
const defaultProps = {
    tabs: [],
    tabNavs: [],
    placement: 'left',
};

/**
 * 카드모양의 탭
 * 버튼 토글로 탭 변경
 */
const MokaCardToggleTabs = (props) => {
    const { className, tabs, tabWidth, tabNavs, tabNavWidth, placement } = props;
    const [currentKey, setCurrentKey] = useState(0);

    /**
     * 버튼 선택 이벤트
     * @param {any} eventKey 이벤트키
     */
    const handleSelect = (eventKey) => {
        if (currentKey.toString() === eventKey) {
            setCurrentKey(-1);
        } else {
            setCurrentKey(eventKey);
        }
    };

    return (
        <div className={clsx('tab', 'card-toggle-tab', 'd-flex', className)}>
            <Tab.Container defaultActiveKey={currentKey}>
                <Tab.Content
                    className={clsx('p-0', {
                        'd-none': currentKey < 0,
                    })}
                    style={{ width: tabWidth }}
                >
                    {tabs.map((tab, idx) => (
                        <Tab.Pane key={idx} eventKey={idx}>
                            {tab}
                        </Tab.Pane>
                    ))}
                </Tab.Content>
                <Card style={{ width: tabNavWidth }}>
                    <Card.Header>
                        <Card.Title>&nbsp;</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        {tabNavs.map((nav, idx) => (
                            <Nav.Item key={idx}>
                                <OverlayTrigger key={idx} placement={placement} overlay={<Tooltip id={`tooltip-${idx}-${nav.title}`}>{nav.title}</Tooltip>}>
                                    <Nav.Link as={Button} eventKey={idx} onSelect={handleSelect}>
                                        <FontAwesomeIcon icon={nav.icon} />
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
