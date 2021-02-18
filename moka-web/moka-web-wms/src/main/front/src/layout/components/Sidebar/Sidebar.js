import React, { Suspense, useCallback, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { changeSidebarOpenItem, initSidebarOpenItem } from '@store/layout/layoutAction';
import SidebarCategory from './SidebarCategory';
import SidebarItem from './SidebarItem';
import logo from '@assets/images/img_logo.png';

/**
 * 사이드바
 */
const Sidebar = ({ match, currentMenu }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const scrollbarRef = useRef(null);
    const { menu } = useSelector((store) => ({
        menu: store.auth.menu,
    }));
    const { sidebarIsOpen, sidebarIsSticky } = useSelector((state) => ({
        sidebarIsOpen: state.layout.sidebarIsOpen,
        sidebarIsSticky: state.layout.sidebarIsSticky,
    }));
    const sidebarOpenItem = useSelector(({ layout }) => layout.sidebarOpenItem);

    useEffect(() => {
        // 사이드바 오픈 아이템 초기화
        if (menu.children !== undefined && Object.keys(sidebarOpenItem).length < 1) {
            dispatch(initSidebarOpenItem(menu.menuOpens));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, menu]);

    const changeNodeToggle = useCallback(
        ({ menuId }) => {
            dispatch(
                changeSidebarOpenItem({
                    menuId,
                    toggleValue: !sidebarOpenItem[menuId],
                }),
            );
            if (scrollbarRef.current) {
                scrollbarRef.current.updateScroll();
            }
        },
        [sidebarOpenItem, dispatch],
    );

    useEffect(() => {
        if (scrollbarRef.current) {
            scrollbarRef.current.updateScroll();
        }
    }, [location]);

    return (
        <Suspense>
            <nav
                className={clsx('sidebar', {
                    toggled: !sidebarIsOpen,
                    'sidebar-sticky': sidebarIsSticky,
                })}
            >
                <div className="sidebar-content">
                    <PerfectScrollbar ref={scrollbarRef} options={{ handlers: ['drag-thumb', 'keyboard', 'wheel', 'touch'], wheelSpeed: 0.5 }}>
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
                                          <SidebarCategory
                                              key={depth1.menuId}
                                              nodeData={depth1}
                                              open={sidebarOpenItem[depth1.menuId]}
                                              onClick={(e) => {
                                                  e.preventDefault();
                                                  e.stopPropagation();
                                                  changeNodeToggle(depth1);
                                              }}
                                              match={currentMenu}
                                          >
                                              <>
                                                  {depth1.children.map((depth2) =>
                                                      depth2.children ? (
                                                          <SidebarCategory
                                                              key={depth2.menuId}
                                                              nodeData={depth2}
                                                              open={sidebarOpenItem[depth2.menuId]}
                                                              onClick={(e) => {
                                                                  e.preventDefault();
                                                                  e.stopPropagation();
                                                                  changeNodeToggle(depth2);
                                                              }}
                                                              match={currentMenu}
                                                          >
                                                              {depth2.children.map((depth3) => (
                                                                  // 3depth
                                                                  <SidebarItem key={depth3.menuId} nodeData={depth3} match={currentMenu} />
                                                              ))}
                                                          </SidebarCategory>
                                                      ) : (
                                                          // 2depth
                                                          <SidebarItem key={depth2.menuId} nodeData={depth2} match={currentMenu} />
                                                      ),
                                                  )}
                                              </>
                                          </SidebarCategory>
                                      ) : (
                                          // 1depth
                                          <SidebarItem key={depth1.menuId} nodeData={depth1} match={currentMenu} />
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
