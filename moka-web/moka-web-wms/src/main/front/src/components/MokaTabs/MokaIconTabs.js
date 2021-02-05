import React, { useState, useEffect, forwardRef, useCallback } from 'react';
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
     * @default
     */
    tabWidth: PropTypes.number,
    /**
     * 탭 컨텐츠의 className
     */
    tabContentClass: PropTypes.string,
    /**
     * tab 컨텐츠(array)
     */
    tabs: PropTypes.arrayOf(PropTypes.node),
    /**
     * 탭 Nav의 width
     * @default
     */
    tabNavWidth: PropTypes.number,
    /**
     * tab 컨텐츠의 Nav(array), tab과 갯수가 동일해야한다
     * @default
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
     * @default
     */
    tabNavPosition: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    /**
     * Tooltip 위치
     * @default
     */
    placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    /**
     * 탭 확장(오픈)
     * @default
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
    /**
     * 탭 확장 가능 여부
     * @default
     */
    foldable: PropTypes.bool,
    /**
     * 탭의 activeKey를 직접 제어하고 싶을 때 전달
     */
    activeKey: PropTypes.any,
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
    foldable: true,
};

/**
 * 아이콘 탭 (AppStack의 탭과 동일한 모양)
 * 아이콘 토글로 탭 변경
 */
const MokaIconTabs = forwardRef((props, ref) => {
    const {
        foldable,
        className,
        height,
        tabs,
        tabWidth,
        tabNavPosition,
        tabNavs,
        tabNavWidth,
        placement,
        expansion,
        onExpansion,
        onSelectNav,
        tabContentClass,
        activeKey: parentKey,
    } = props;
    const [activeKey, setActiveKey] = useState(0);
    const [isExpand, setIsExpand] = useState(true);

    /**
     * 버튼 선택 콜백
     * @param {any} eventKey 이벤트키
     */
    const handleSelect = useCallback(
        (eventKey, e) => {
            setActiveKey(eventKey);
            if (foldable) {
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
            }
            if (onSelectNav) {
                onSelectNav(Number(eventKey));
            }
            if (e) {
                e.currentTarget.blur();
            }
        },
        [activeKey, foldable, isExpand, onExpansion, onSelectNav],
    );

    const tabNavPlacement = clsx({
        'tab-vertical flex-row-reverse': tabNavPosition === 'left' ? true : false,
        'tab-vertical': tabNavPosition === 'right' ? true : false,
        'flex-column': tabNavPosition === 'top' ? true : false,
        'flex-column-reverse': tabNavPosition === 'bottom' ? true : false,
    });

    useEffect(() => {
        setIsExpand(expansion);
    }, [expansion]);

    useEffect(() => {
        // 탭의 activeKey를 직접 제어
        if (parentKey !== null && parentKey !== undefined) {
            handleSelect(String(parentKey));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parentKey]);

    return (
        <div ref={ref} className={clsx('tab', 'icon-toggle-tab', 'd-flex', tabNavPlacement, className)} style={{ height }}>
            <Tab.Container activeKey={activeKey}>
                {/* 탭 컨텐츠 */}
                <Tab.Content
                    className={clsx(
                        'flex-fill p-0',
                        {
                            'd-none': !isExpand,
                        },
                        tabContentClass,
                    )}
                    style={{ width: tabWidth }}
                >
                    {tabs.map((tab, idx) => (
                        <Tab.Pane className="h-100" key={idx} eventKey={idx}>
                            {tab}
                        </Tab.Pane>
                    ))}
                </Tab.Content>

                {/* 탭 Nav */}
                <Nav variant="tabs" className="d-flex flex-shrink-0" style={{ width: tabNavWidth }}>
                    {tabNavs.map((nav, idx) => (
                        <Nav.Item key={idx}>
                            <OverlayTrigger key={idx} placement={placement} overlay={<Tooltip id={`tooltip-${idx}-${nav.title}`}>{nav.title}</Tooltip>}>
                                <Nav.Link
                                    eventKey={idx}
                                    onSelect={handleSelect}
                                    className="text-center flex-fill h-100 border-0 pl-0 pr-0 d-flex justify-content-center align-items-center"
                                    active={activeKey.toString() === idx.toString() && isExpand}
                                    variant="gray-150"
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
