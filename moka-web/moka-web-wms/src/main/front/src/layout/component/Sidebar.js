import React, { useEffect } from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink, useLocation } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Collapse from 'react-bootstrap/Collapse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

import { initSidebarOpenItem, changeSidebarOpenItem } from '@store/layout/action';
import menu from './menu.json';

// 아이콘 등록
library.add(faCoffee);

// routes => api 변경
// import routes from '@/routes';

const Sidebar = (props) => {
    const { nonResponsive } = props;
    const dispatch = useDispatch();
    const location = useLocation();
    const nodes = menu.resultInfo.body.nodes.nodes;

    // store state
    const { sidebarIsOpen, sidebarIsSticky, sidebarOpenItem } = useSelector((state) => ({
        sidebarIsOpen: state.layout.sidebarIsOpen,
        sidebarIsSticky: state.layout.sidebarIsSticky,
        sidebarOpenItem: state.layout.sidebarOpenItem
    }));

    useEffect(() => {
        // 사이드바 오픈 아이템 초기화
        if (Object.keys(sidebarOpenItem).length < 1) {
            const expandNodes = nodes.filter((node) => node.nodes);
            const initValue = expandNodes.reduce((result, item, idx, array) => {
                result[item.menuId] = false;
                return result;
            }, {});
            dispatch(initSidebarOpenItem(initValue));
        }
    }, [dispatch, sidebarOpenItem, nodes]);

    const changeNodeToggle = ({ menuId }) => {
        dispatch(
            changeSidebarOpenItem({
                menuId,
                toggleValue: !sidebarOpenItem[menuId]
            })
        );
    };

    // 사이드바 카테고리(Collapse 영역) 생성
    const SidebarCategory = ({ nodeData, children }) => {
        const controls = `sidebar-collapse-${nodeData.menuId}`;
        const open = sidebarOpenItem[nodeData.menuId];

        return (
            <li className={clsx('sidebar-item', { active: open })}>
                <span
                    className={clsx('sidebar-link', { collapsed: !open })}
                    onClick={() => changeNodeToggle(nodeData)}
                    aria-controls={controls}
                    aria-expanded={open}
                    data-toggle="collapse"
                >
                    {nodeData.iconName && (
                        <FontAwesomeIcon icon={nodeData.iconName} className="align-middle mr-3" />
                    )}
                    <span className="align-middle">{nodeData.menuDispName}</span>
                </span>
                <Collapse in={open}>
                    <div id={controls}>
                        <ul id="item" className="sidebar-dropdown list-unstyled">
                            {children}
                        </ul>
                    </div>
                </Collapse>
            </li>
        );
    };

    // 사이드바 아이템 생성
    const SidebarItem = ({ nodeData }) => {
        return (
            <li
                className={clsx('sidebar-item', {
                    active: location.pathname === nodeData.menuPath || null
                })}
            >
                <NavLink
                    to={nodeData.menuPath || ''}
                    className="sidebar-link"
                    activeClassName="active"
                >
                    {nodeData.iconName && (
                        <FontAwesomeIcon icon={nodeData.iconName} className="align-middle mr-3" />
                    )}
                    {nodeData.menuDispName}
                </NavLink>
            </li>
        );
    };

    return (
        <nav
            className={clsx('sidebar', {
                toggled: !sidebarIsOpen && !nonResponsive,
                'sidebar-sticky': sidebarIsSticky && !nonResponsive
            })}
        >
            <div className="sidebar-content">
                <PerfectScrollbar>
                    <Link className="sidebar-brand" to="/">
                        <span className="align-middle">The JoongAng</span>
                    </Link>

                    <ul className="sidebar-nav">
                        {/* 3depth까지만 그려서 재귀로 처리하지 않음 */}
                        {nodes.map((dep1Node) =>
                            dep1Node.nodes ? (
                                <SidebarCategory key={dep1Node.menuId} nodeData={dep1Node}>
                                    {dep1Node.nodes.nodes.map((dep2Node) =>
                                        dep2Node.nodes ? (
                                            <SidebarCategory
                                                key={dep2Node.menuId}
                                                nodeData={dep2Node}
                                            >
                                                {dep2Node.nodes.nodes.map((dep3Node) => (
                                                    // 3depth
                                                    <SidebarItem
                                                        key={dep3Node.menuId}
                                                        nodeData={dep3Node}
                                                    />
                                                ))}
                                            </SidebarCategory>
                                        ) : (
                                            // 2depth
                                            <SidebarItem
                                                key={dep2Node.menuId}
                                                nodeData={dep2Node}
                                            />
                                        )
                                    )}
                                </SidebarCategory>
                            ) : (
                                // 1depth
                                <SidebarItem key={dep1Node.menuId} nodeData={dep1Node} />
                            )
                        )}
                    </ul>
                </PerfectScrollbar>
            </div>
        </nav>
    );
};

export default Sidebar;
