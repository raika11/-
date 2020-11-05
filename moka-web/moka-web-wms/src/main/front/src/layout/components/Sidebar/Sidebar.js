import React, { Suspense, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { changeSidebarOpenItem, initSidebarOpenItem } from '@store/layout/layoutAction';
import SidebarCategory from './SidebarCategory';
import SidebarItem from './SidebarItem';

// .json => api 변경
//import menu from './menu.json';

const Sidebar = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { menu } = useSelector((store) => ({
        menu: store.auth.menu.children,
    }));

    let localPath = '';
    if (location.pathname === '/') {
        localPath = location.pathname;
    } else if (location.pathname.length > 0) {
        localPath = location.pathname.split('/')[1];
    }

    const { sidebarIsOpen, sidebarIsSticky, sidebarOpenItem } = useSelector((state) => ({
        sidebarIsOpen: state.layout.sidebarIsOpen,
        sidebarIsSticky: state.layout.sidebarIsSticky,
        sidebarOpenItem: state.layout.sidebarOpenItem,
    }));

    useEffect(() => {
        // 사이드바 오픈 아이템 초기화
        const openItem = {};
        const getOpenMenuParentMenuId = (menu) => {
            for (let i = 0; i < menu.length; i++) {
                const menuItem = menu[i];

                if (menuItem.children !== null) {
                    const isOpen = getOpenMenuParentMenuId(menuItem.children);
                    if (isOpen) {
                        openItem[menuItem.parentMenuId] = true;
                    }
                } else {
                    let menuPath = '';
                    if (menuItem.menuUrl.length > 0) {
                        menuPath = menuItem.menuUrl.split('/')[1];
                    }
                    if (localPath === menuPath) {
                        console.log(menuItem.parentMenuId);
                        openItem[menuItem.parentMenuId] = true;
                        return true;
                    }
                }
            }
        };

        if (menu !== undefined && Object.keys(sidebarOpenItem).length < 1 && localPath !== '/') {
            getOpenMenuParentMenuId(menu);
            console.log(openItem);
            dispatch(initSidebarOpenItem(openItem));
        }
    }, [dispatch, localPath, menu, sidebarOpenItem]);

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
