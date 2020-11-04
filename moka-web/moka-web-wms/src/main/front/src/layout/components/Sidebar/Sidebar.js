import React, { Suspense, useEffect, useCallback, useState } from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { changeSidebarOpenItem, initSidebarOpenItem } from '@store/layout/layoutAction';
import SidebarCategory from './SidebarCategory';
import SidebarItem from './SidebarItem';

// .json => api 변경
//import menu from './menu.json';

const Sidebar = (props) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { menu } = useSelector((store) => ({
        menu: store.auth.menu.children,
    }));

    const { sidebarIsOpen, sidebarIsSticky, sidebarOpenItem } = useSelector((state) => ({
        sidebarIsOpen: state.layout.sidebarIsOpen,
        sidebarIsSticky: state.layout.sidebarIsSticky,
        sidebarOpenItem: state.layout.sidebarOpenItem,
    }));

    useEffect(() => {
        // 사이드바 오픈 아이템 초기화
        if (menu !== undefined && Object.keys(sidebarOpenItem).length < 1) {
            const expandChildren = menu.filter((menu) => menu.children);
            const initValue = expandChildren.reduce((result, item, idx, array) => {
                result[item.menuId] = false;
                return result;
            }, {});
            console.log(initValue);
            dispatch(initSidebarOpenItem(initValue));
        }
    }, [dispatch, menu, sidebarOpenItem]);

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
        <Suspense>
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
                            {menu
                                ? menu.map((depth1) =>
                                      depth1.children ? (
                                          <SidebarCategory key={depth1.menuId} nodeData={depth1} open={sidebarOpenItem[depth1.menuId]} onClick={() => changeNodeToggle(depth1)}>
                                              <>
                                                  {depth1.children.map((depth2) =>
                                                      depth2.children ? (
                                                          <SidebarCategory
                                                              key={depth2.menuId}
                                                              nodeData={depth2}
                                                              open={sidebarOpenItem[depth2.menuId]}
                                                              onClick={() => changeNodeToggle(depth2)}
                                                          >
                                                              <>
                                                                  {depth2.children.map((depth3) => (
                                                                      // 3depth
                                                                      <SidebarItem key={depth3.menuId} nodeData={depth3} />
                                                                  ))}
                                                              </>
                                                          </SidebarCategory>
                                                      ) : (
                                                          // 2depth
                                                          <SidebarItem key={depth2.menuId} nodeData={depth2} />
                                                      ),
                                                  )}
                                              </>
                                          </SidebarCategory>
                                      ) : (
                                          // 1depth
                                          <SidebarItem key={depth1.menuId} nodeData={depth1} />
                                      ),
                                  )
                                : ''}
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </Suspense>
    );
};

export default Sidebar;
