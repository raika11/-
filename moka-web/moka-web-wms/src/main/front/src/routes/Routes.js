import React, { Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';

// routes
import routes from './index';
import { getUserMenuTree, getDomainList } from '@store/auth/authAction';

// component
import Loader from '@layout/components/Loader';
import { MokaLoader, ScrollToTop } from '@components';
import SpinnerComponent from '@/pages/TestBoard/SpinnerComponent';

const Routes = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUserMenuTree());
        // 전체 도메인리스트 조회
        dispatch(getDomainList());
    }, [dispatch]);

    return (
        <ScrollToTop>
            <Switch>
                {routes.map(({ path, layout: Layout, component: Component, name, nonResponsive, ...rest }) => (
                    <Route
                        key={name}
                        path={path}
                        {...rest}
                        render={(props) => (
                            <Layout nonResponsive={nonResponsive}>
                                <Suspense fallback={<MokaLoader />}>
                                    <Component {...props} />
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
