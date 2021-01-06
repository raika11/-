import React, { Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';

// routes
import routes from './index';
import { getUserMenuTree, changeLatestMenuId } from '@store/auth/authAction';
import { MokaLoader, ScrollToTop } from '@components';

const Routes = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { menu } = useSelector((store) => ({
        menu: store.auth.menu,
    }));

    let pathName = '';
    if (location.pathname === '/') {
        pathName = location.pathname;
    } else if (location.pathname.length > 0) {
        pathName = '/' + location.pathname.split('/')[1];
    }

    useEffect(() => {
        if (menu.length === 0) {
            dispatch(getUserMenuTree({ pathName: pathName }));
        } else {
            if (menu.menuPaths[pathName] === undefined) {
                window.location.href = '/404';
            } else {
                dispatch(changeLatestMenuId(menu.menuPaths[pathName]));
            }
        }
    }, [dispatch, menu, pathName]);

    return (
        <ScrollToTop>
            <Switch>
                {routes.map(({ path, layout: Layout, component: Component, name, nonResponsive, ...rest }) => (
                    <Route
                        key={name}
                        path={path}
                        {...rest}
                        render={(props) => (
                            <Layout nonResponsive={nonResponsive} name={name} {...props} {...rest}>
                                <Suspense fallback={<MokaLoader clsOpt="black" />}>
                                    <Component {...props} name={name} {...rest} />
                                </Suspense>
                            </Layout>
                        )}
                    />
                ))}
                <Redirect from="*" to="/404" />
            </Switch>
        </ScrollToTop>
    );
};

export default Routes;
