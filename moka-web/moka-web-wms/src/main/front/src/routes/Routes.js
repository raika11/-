import React, { Suspense, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import utils from '@utils/commonUtil';
import { getUserMenuTree, changeLatestMenuId } from '@store/auth/authAction';
import { MokaLoader, ScrollToTop, MokaErrorBoundary } from '@components';
import routes from './index'; // routes

const MenuBox = ({ children, menu, path, nonResponsive = false, side = true }) => {
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        if (menu.length === 0) {
            dispatch(getUserMenuTree({ pathName: path }));
        } else {
            if (menu.menuPaths[path] === undefined) {
                history.push('/404');
            } else {
                const menuId = menu.menuPaths[path];
                const currentMenu = utils.isEmpty(menuId) ? null : menu.menuById[menuId];
                dispatch(changeLatestMenuId({ menuId, currentMenu, nonResponsive, side }));
            }
        }
    }, [side, dispatch, history, menu.length, menu.menuById, menu.menuPaths, nonResponsive, path]);

    return React.cloneElement(children, { menuPaths: menu.menuPaths, menuById: menu.menuById, nonResponsive, side });
};

/**
 * 페이지 Routes
 */
const Routes = () => {
    const { menu } = useSelector((store) => ({
        menu: store.auth.menu,
    }));

    return (
        <ScrollToTop>
            <Switch>
                {routes.map(({ path, component: Component, name, nonResponsive, side, ...rest }) => (
                    <Route
                        key={name}
                        path={path}
                        {...rest}
                        render={(props) => (
                            <MenuBox path={path} menu={menu} nonResponsive={nonResponsive} side={side}>
                                <MokaErrorBoundary>
                                    <Suspense fallback={<MokaLoader clsOpt="black" />}>
                                        <Component {...props} name={name} {...rest} />
                                    </Suspense>
                                </MokaErrorBoundary>
                            </MenuBox>
                        )}
                    />
                ))}
                <Redirect from="*" to="/404" />
            </Switch>
        </ScrollToTop>
    );
};

export default Routes;
