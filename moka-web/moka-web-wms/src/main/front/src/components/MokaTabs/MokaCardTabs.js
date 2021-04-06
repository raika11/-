import React, { useState, useEffect, useCallback } from 'react';
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
     * Nav Item width
     */
    navWidth: PropTypes.number,
    /**
     * 탭 컨텐츠의 className
     */
    tabContentClassName: PropTypes.string,
    /**
     * 탭 컨텐츠 wrapper의 className
     */
    tabContentWrapperClassName: PropTypes.string,
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
     * string이거나 object
     */
    tabNavs: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                idx: PropTypes.number,
                name: PropTypes.string,
            }),
        ]),
    ),
    /**
     * nav 클릭 콜백
     */
    onSelectNav: PropTypes.func,
    /**
     * 탭의 activeKey를 직접 제어하고 싶을 때 전달
     */
    activeKey: PropTypes.any,
};
const defaultProps = {
    width: 410,
    height: CARD_DEFAULT_HEIGHT,
    fill: false,
    tabs: [],
    tabNavs: [],
};

/**
 * 카드 외형 + 상단에 탭이 달린 컴포넌트 (SSC 개발)
 */
const MokaCardTabs = (props) => {
    const { className, fill, id, tabs, tabNavs, width, navWidth, height, tabContentClassName, tabContentWrapperClassName, onSelectNav, activeKey: parentKey } = props;
    const [activeKey, setActiveKey] = useState(0);

    /**
     * Nav 선택 콜백
     * @param {any} eventKey 이벤트키
     */
    const handleSelect = useCallback(
        (eventKey, e) => {
            setActiveKey(eventKey);
            if (onSelectNav) {
                onSelectNav(Number(eventKey));
            }
            if (e) {
                e.currentTarget.blur();
            }
        },
        [onSelectNav],
    );

    useEffect(() => {
        // 탭의 activeKey를 직접 제어
        if (parentKey !== null && parentKey !== undefined) {
            handleSelect(String(parentKey));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parentKey]);

    return (
        <div className={clsx('tab card-tab flex-fill', className)} style={{ width, height }}>
            <Tab.Container id={id} activeKey={activeKey}>
                <div className="d-flex px-card">
                    <Nav fill={fill} activeKey={activeKey} variant="tabs" className="flex-row" onSelect={handleSelect}>
                        {tabNavs.map((nav, idx) => {
                            if (!nav) return null;
                            else if (typeof nav === 'string') {
                                return (
                                    <Nav.Item key={idx} style={{ width: navWidth }}>
                                        <Nav.Link eventKey={idx} className="h4">
                                            {nav}
                                        </Nav.Link>
                                    </Nav.Item>
                                );
                            } else if (typeof nav === 'object') {
                                return (
                                    <Nav.Item key={nav.idx || idx} style={{ width: navWidth }}>
                                        <Nav.Link eventKey={nav.idx || idx} className="h4">
                                            {nav.name}
                                        </Nav.Link>
                                    </Nav.Item>
                                );
                            } else return null;
                        })}
                    </Nav>
                </div>
                <div className={clsx('d-flex mb-card overflow-hidden', tabContentWrapperClassName)}>
                    <Tab.Content className={clsx('p-0', tabContentClassName)}>
                        {tabs.map((tab, idx) =>
                            tab ? (
                                <Tab.Pane key={idx} eventKey={tab.idx || idx} className="overflow-hidden h-100">
                                    <div className="pt-20 px-card h-100 custom-scroll">{tab}</div>
                                </Tab.Pane>
                            ) : (
                                ''
                            ),
                        )}
                    </Tab.Content>
                </div>
            </Tab.Container>
        </div>
    );
};

MokaCardTabs.propTypes = propTypes;
MokaCardTabs.defaultProps = defaultProps;

export default MokaCardTabs;
