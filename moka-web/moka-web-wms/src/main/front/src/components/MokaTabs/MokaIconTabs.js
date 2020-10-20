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
    tabNavs: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            icon: PropTypes.node,
            text: PropTypes.string,
        }),
    ),
    /**
     * tab의 위치
     */
    tabNavPosition: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
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
    /**
     * nav 클릭 콜백
     */
    onSelectNav: PropTypes.func,
};

const defaultProps = {
    tabNavPosition: 'right',
    tabs: [],
    tabWidth: 600,
    tabNavs: [],
    tabNavWidth: 52,
    placement: 'left',
    expansion: true,
    onExpansion: null,
    onSelectNav: null,
};

/**
 * 아이콘 탭
 * 아이콘 토글로 탭 변경
 */
const MokaIconTabs = forwardRef((props, ref) => {
    const { className, height, tabs, tabWidth, tabNavPosition, tabNavs, tabNavWidth, placement, expansion, onExpansion, onSelectNav } = props;
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

        if (onSelectNav) {
            onSelectNav(eventKey);
        }
    };

    const tabNavPlacement = clsx({
        'tab-vertical flex-row-reverse': tabNavPosition === 'left' ? true : false,
        'tab-vertical': tabNavPosition === 'right' ? true : false,
        'flex-column': tabNavPosition === 'top' ? true : false,
        'flex-column-reverse': tabNavPosition === 'bottom' ? true : false,
    });

    return (
        <div ref={ref} className={clsx('tab', 'icon-toggle-tab', 'd-flex', tabNavPlacement, className)} style={{ height }}>
            <Tab.Container defaultActiveKey={activeKey}>
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

                {/* 탭 Nav */}
                <Nav variant="tabs" className="d-flex" style={{ width: tabNavWidth }}>
                    {tabNavs.map((nav, idx) => (
                        <Nav.Item key={idx}>
                            <OverlayTrigger key={idx} placement={placement} overlay={<Tooltip id={`tooltip-${idx}-${nav.title}`}>{nav.title}</Tooltip>}>
                                <Nav.Link
                                    eventKey={idx}
                                    onSelect={handleSelect}
                                    className="text-center flex-fill border-0 pl-0 pr-0 d-flex justify-content-center"
                                    active={activeKey.toString() === idx.toString() && isExpand}
                                    variant="gray150"
                                >
                                    {nav.icon || <span className="h6 mb-0">{nav.text}</span>}
                                </Nav.Link>
                            </OverlayTrigger>
                        </Nav.Item>
                    ))}
                </Nav>
            </Tab.Container>
        </div>
    );
});

MokaIconTabs.propTypes = propTypes;
MokaIconTabs.defaultProps = defaultProps;

export default MokaIconTabs;
