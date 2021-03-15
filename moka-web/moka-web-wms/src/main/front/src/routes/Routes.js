import React, { Suspense, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import utils from '@utils/commonUtil';

// routes
import routes from './index';
import { getUserMenuTree, changeLatestMenuId } from '@store/auth/authAction';
import { MokaLoader, ScrollToTop } from '@components';

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
                                <Suspense fallback={<MokaLoader clsOpt="black" />}>
                                    <Component {...props} name={name} {...rest} />
                                </Suspense>
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
