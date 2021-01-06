import React, { Suspense, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';

// routes
import routes from './index';
import { getUserMenuTree, changeLatestMenuId } from '@store/auth/authAction';
import { MokaLoader, ScrollToTop } from '@components';

const MenuBox = ({ children, menu, path }) => {
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        if (menu.length === 0) {
            dispatch(getUserMenuTree({ pathName: path }));
        } else {
            if (menu.menuPaths[path] === undefined) {
                history.push('/404');
            } else {
                dispatch(changeLatestMenuId(menu.menuPaths[path]));
            }
        }
    }, [dispatch, history, menu.length, menu.menuPaths, path]);

    return children;
};

const Routes = () => {
    const { menu } = useSelector((store) => ({
        menu: store.auth.menu,
    }));

    return (
        <ScrollToTop>
            <Switch>
                {routes.map(({ path, layout: Layout, component: Component, name, nonResponsive, ...rest }) => (
                    <Route
                        key={name}
                        path={path}
                        {...rest}
                        render={(props) => (
                            <MenuBox path={path} menu={menu}>
                                <Layout nonResponsive={nonResponsive} name={name} {...props} {...rest}>
                                    <Suspense fallback={<MokaLoader clsOpt="black" />}>
                                        <Component {...props} name={name} {...rest} />
                                    </Suspense>
                                </Layout>
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
