import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { CARD_DEFAULT_HEIGHT } from '@/constants';
import { MokaCard, MokaIcon } from '@components';

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
    tabs: [],
    height: CARD_DEFAULT_HEIGHT,
    tabWidth: 412,
    tabNavs: [],
    tabNavWidth: 48,
    placement: 'left',
    expansion: true,
    onExpansion: null,
};

/**
 * 카드모양의 탭
 * 버튼 토글로 탭 변경
 */
const MokaCardToggleTabs = (props) => {
    const { className, height, tabs, tabWidth, tabNavs, tabNavWidth, placement, expansion, onExpansion } = props;
    const [activeKey, setActiveKey] = useState(0);
    const [isExpand, setIsExpand] = useState(true);

    useEffect(() => {
        setIsExpand(expansion);
    }, [expansion]);

    /**
     * 버튼 선택 이벤트
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

    /**
     * 헤더의 확장 버튼
     */
    const handleExpansion = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (onExpansion) onExpansion(!isExpand);
        else setIsExpand(!isExpand);
    };

    return (
        <div className={clsx('tab', 'card-toggle-tab', 'd-flex', className)} style={{ height }}>
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
                <MokaCard
                    className="border-left-0"
                    width={tabNavWidth}
                    headerClassName="pl-0 pr-0 d-flex align-items-center justify-content-center"
                    bodyClassName="p-0 m-0"
                    titleAs={
                        <Button variant="white" className="p-0" onClick={handleExpansion}>
                            <MokaIcon iconName="fal-angle-double-left" rotation={isExpand ? 0 : 180} />
                        </Button>
                    }
                >
                    {tabNavs.map((nav, idx) => (
                        <Nav.Item key={idx} className="mb-1 p-05 d-flex">
                            <OverlayTrigger key={idx} placement={placement} overlay={<Tooltip id={`tooltip-${idx}-${nav.title}`}>{nav.title}</Tooltip>}>
                                <Nav.Link
                                    as={Button}
                                    eventKey={idx}
                                    onSelect={handleSelect}
                                    className={clsx('p-1', 'pt-2', 'pb-2', 'text-center', 'flex-fill', 'border-0', {
                                        active: activeKey.toString() === idx.toString(),
                                    })}
                                    variant="gray150"
                                >
                                    {nav.icon}
                                </Nav.Link>
                            </OverlayTrigger>
                        </Nav.Item>
                    ))}
                </MokaCard>
            </Tab.Container>
        </div>
    );
};

MokaCardToggleTabs.propTypes = propTypes;
MokaCardToggleTabs.defaultProps = defaultProps;

export default MokaCardToggleTabs;
