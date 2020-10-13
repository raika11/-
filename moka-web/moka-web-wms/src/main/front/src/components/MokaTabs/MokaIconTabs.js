import React, { useState, useEffect, forwardRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

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
    /**
     * tab의 위치
     */
    tabNavPosition: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    tabNavs: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            icon: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
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
    tabNavPosition: 'left',
    tabs: [],
    tabWidth: 600,
    tabNavs: [],
    tabNavWidth: 52,
    placement: 'left',
    expansion: true,
    onExpansion: null,
};

/**
 * 탭
 * 토글로 탭 변경
 */
const MokaIconTabs = (props) => {
    const { className, height, tabs, tabWidth, tabNavPosition, tabNavs, tabNavWidth, placement, expansion, onExpansion } = props;
    const [activeKey, setActiveKey] = useState(0);
    const [isExpand, setIsExpand] = useState(true);

    useEffect(() => {
        setIsExpand(expansion);
    }, [expansion]);

    /**
     * 버튼 선택 콜백
     * @param {any} eventKey 이벤트키
     */
    const handleSelect = (eventKey) => {
        setActiveKey(eventKey);
        if (!isExpand) {
            if (onExpansion) onExpansion(true);
            else setIsExpand(true);
        } else {
            if (activeKey.toString() === eventKey) {
                if (onExpansion) onExpansion(false);
                else setIsExpand(false);
            } else {
                if (onExpansion) onExpansion(true);
                else setIsExpand(true);
            }
        }
    };

    const tabNavPlacement = clsx({
        'd-flex': tabNavPosition === 'left' ? true : false,
        'd-flex flex-row-reverse': tabNavPosition === 'right' ? true : false,
        'd-flex flex-column': tabNavPosition === 'top' ? true : false,
        'd-flex flex-column-reverse': tabNavPosition === 'bottom' ? true : false,
    });

    return (
        <div tabNavPosition={tabNavPosition} className={clsx('tab', 'icon-toggle-tab', tabNavPlacement, className)} style={{ height }}>
            <Tab.Container defaultActiveKey={activeKey}>
                {/* 탭 Nav */}
                <Nav variant="pills" className="d-flex" style={{ width: tabNavWidth }}>
                    {tabNavs.map((nav, idx) => (
                        <Nav.Item key={idx} className="mb-1">
                            <OverlayTrigger key={idx} placement={placement} overlay={<Tooltip id={`tooltip-${idx}-${nav.title}`}>{nav.title}</Tooltip>}>
                                <Nav.Link
                                    eventKey={idx}
                                    onSelect={handleSelect}
                                    className={clsx('text-center', 'flex-fill', 'border-0', {
                                        active: activeKey.toString() === idx.toString(),
                                    })}
                                    variant="gray150"
                                >
                                    {nav.icon}
                                </Nav.Link>
                            </OverlayTrigger>
                        </Nav.Item>
                    ))}
                </Nav>

                {/* 탭 컨텐츠 */}
                <Tab.Content
                    className={clsx('p-0', {
                        'd-none': !isExpand,
                    })}
                    style={{ width: tabWidth }}
                >
                    {tabs.map((tab, idx) => (
                        <Tab.Pane className="h-100" key={idx} eventKey={idx}>
                            {tab}
                        </Tab.Pane>
                    ))}
                </Tab.Content>
            </Tab.Container>
        </div>
    );
};

MokaIconTabs.propTypes = propTypes;
MokaIconTabs.defaultProps = defaultProps;

export default MokaIconTabs;
