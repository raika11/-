import React, { Suspense, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { changeSidebarOpenItem, initSidebarOpenItem } from '@store/layout/layoutAction';
import SidebarCategory from './SidebarCategory';
import SidebarItem from './SidebarItem';
import logo from '@assets/images/img_logo.png';

/**
 * 사이드바
 */
const Sidebar = () => {
    const dispatch = useDispatch();
    const { menu } = useSelector((store) => ({
        menu: store.auth.menu,
    }));

    const { sidebarIsOpen, sidebarIsSticky, sidebarOpenItem } = useSelector((state) => ({
        sidebarIsOpen: state.layout.sidebarIsOpen,
        sidebarIsSticky: state.layout.sidebarIsSticky,
        sidebarOpenItem: state.layout.sidebarOpenItem,
    }));

    useEffect(() => {
        // 사이드바 오픈 아이템 초기화
        if (menu.children !== undefined && Object.keys(sidebarOpenItem).length < 1) {
            dispatch(initSidebarOpenItem(menu.menuOpens));
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
                    <PerfectScrollbar options={{ handlers: ['drag-thumb', 'keyboard', 'wheel', 'touch'] }}>
                        <Link className="sidebar-brand mt-3" to="/">
                            <span>
                                <img src={logo} alt="joongang" />
                            </span>
                        </Link>

                        <ul className="sidebar-nav">
                            {/* 3depth까지만 그려서 재귀로 처리하지 않음 */}
                            {menu.children
                                ? menu.children.map((depth1) =>
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
