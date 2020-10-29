import React, { useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { initSidebarOpenItem, changeSidebarOpenItem } from '@store/layout/layoutAction';
import SidebarCategory from './SidebarCategory';
import SidebarItem from './SidebarItem';

// .json => api 변경
import menu from './menu.json';

const Sidebar = (props) => {
    const dispatch = useDispatch();
    const nodes = menu.resultInfo.body.nodes.nodes;

    // store state
    const { sidebarIsOpen, sidebarIsSticky, sidebarOpenItem } = useSelector((state) => ({
        sidebarIsOpen: state.layout.sidebarIsOpen,
        sidebarIsSticky: state.layout.sidebarIsSticky,
        sidebarOpenItem: state.layout.sidebarOpenItem,
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

    const changeNodeToggle = useCallback(
        ({ menuId }) => {
            dispatch(
                changeSidebarOpenItem({
                    menuId,
                    toggleValue: !sidebarOpenItem[menuId],
                }),
            );
        },
        [sidebarOpenItem, dispatch],
    );

    return (
        <nav
            className={clsx('sidebar', {
                toggled: !sidebarIsOpen,
                'sidebar-sticky': sidebarIsSticky,
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
                                <SidebarCategory key={dep1Node.menuId} nodeData={dep1Node} open={sidebarOpenItem[dep1Node.menuId]} onClick={() => changeNodeToggle(dep1Node)}>
                                    <>
                                        {dep1Node.nodes.nodes.map((dep2Node) =>
                                            dep2Node.nodes ? (
                                                <SidebarCategory
                                                    key={dep2Node.menuId}
                                                    nodeData={dep2Node}
                                                    open={sidebarOpenItem[dep2Node.menuId]}
                                                    onClick={() => changeNodeToggle(dep2Node)}
                                                >
                                                    <>
                                                        {dep2Node.nodes.nodes.map((dep3Node) => (
                                                            // 3depth
                                                            <SidebarItem key={dep3Node.menuId} nodeData={dep3Node} />
                                                        ))}
                                                    </>
                                                </SidebarCategory>
                                            ) : (
                                                // 2depth
                                                <SidebarItem key={dep2Node.menuId} nodeData={dep2Node} />
                                            ),
                                        )}
                                    </>
                                </SidebarCategory>
                            ) : (
                                // 1depth
                                <SidebarItem key={dep1Node.menuId} nodeData={dep1Node} />
                            ),
                        )}
                    </ul>
                </PerfectScrollbar>
            </div>
        </nav>
    );
};

export default Sidebar;
